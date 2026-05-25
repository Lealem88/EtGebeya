<?php
// backend/api/ai/chatbot.php — Generative AI Support Chatbot using Google Gemini API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../helpers/response.php';

$data = json_decode(file_get_contents("php://input"), true);
$message = trim($data['message'] ?? '');
$history = $data['history'] ?? [];

if (empty($message)) {
    jsonResponse(false, "Message is empty", null, 400);
}

// ─── Gemini API Configuration ─────────────────────────────────────────────
$apiKey = defined('GEMINI_API_KEY') ? GEMINI_API_KEY : '';
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

$systemInstruction = "You are EtBot, the official AI assistant for EtGebeya, Ethiopia's premier peer-to-peer marketplace.
Your goal is to help buyers and sellers navigate the platform. Keep your answers concise, friendly, and formatted nicely in markdown.

Platform context:
- Users can buy/sell new and used electronics safely.
- Trust Scores rate sellers (Platinum, Gold, Silver, Bronze) based on their history.
- AI Market Pricing helps users know if a price is fair (USD * 170 ETB).
- Users can negotiate with AI, do Voice Search, and Visual Search via the search bar.
- Always advise meeting in public places (e.g. cafes, malls) and inspecting items before paying. Avoid sending money in advance.
- If the user asks for a human, support, or admin, tell them they can reach out at admin@etgebeya.com or call +251 900 000 000.

Be conversational, real-time, and helpful. If you don't know something, say so politely.";

// Format history for Gemini (Gemini expects user/model roles)
$contents = [];
foreach ($history as $msg) {
    // Skip system/greeting injection if it's the first message
    $role = $msg['role'] === 'bot' ? 'model' : 'user';
    $contents[] = [
        "role" => $role,
        "parts" => [["text" => $msg['text']]]
    ];
}

// Append current user message
$contents[] = [
    "role" => "user",
    "parts" => [["text" => $message]]
];

$postData = [
    "system_instruction" => [
        "parts" => [["text" => $systemInstruction]]
    ],
    "contents" => $contents,
    "generationConfig" => [
        "temperature" => 0.4,
        "maxOutputTokens" => 500,
    ]
];

// Fallback response if API key is missing
if (empty($apiKey)) {
    jsonResponse(true, "Mock response", [
        'reply' => "I'm sorry, my AI connection is currently offline (Missing API Key). Please contact **admin@etgebeya.com**.",
        'quickReplies' => ['Contact admin']
    ]);
}

// cURL Request to Gemini
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For local XAMPP dev

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($httpCode !== 200 || !$response) {
    $errorMsg = "I'm having trouble thinking right now. 😔 Please try again later.";
    
    // Check if it's a quota error
    if (isset($result['error']['code']) && $result['error']['code'] === 429) {
        $errorMsg = "⚠️ **API Quota Exceeded!** The Google Gemini API key provided has run out of free quota. Please check your Google AI Studio billing/plan.";
    }

    jsonResponse(false, "AI Service Error", [
        'reply' => $errorMsg,
        'debug' => $response
    ], 500);
}

$replyText = $result['candidates'][0]['content']['parts'][0]['text'] ?? "I'm not sure how to respond to that.";

// Suggest quick replies based on intent loosely
$quickReplies = [];
if (stripos($replyText, 'admin@etgebeya') !== false) {
    // Do nothing
} else if (stripos($message, 'scam') !== false || stripos($message, 'safe') !== false) {
    $quickReplies = ['How does Trust Score work?'];
} else if (stripos($message, 'sell') !== false) {
    $quickReplies = ['How do I post an item?', 'Pricing tips'];
} else {
    $quickReplies = ['Find a laptop', 'Contact admin'];
}

jsonResponse(true, "AI Response", [
    'reply' => $replyText,
    'quickReplies' => $quickReplies
]);
?>
