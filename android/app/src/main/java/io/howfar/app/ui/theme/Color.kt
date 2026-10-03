package io.howfar.app.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * Design tokens — sourced 1:1 from howfar-app-v9.html (ReplyMate kit) and
 * brand/src/index.css (flare/volt motion accents). Do not invent values here;
 * if it isn't in the tokens file, it isn't a colour we use.
 */

// ReplyMate chassis
val Bg       = Color(0xFF0D1117)
val Card     = Color(0xFF161B22)
val Stroke   = Color(0xFF2A3139)
val Field    = Color(0xFF11161D)

// Brand accent
val Accent      = Color(0xFF0A84FF)
val AccentPress = Color(0xFF0871D8)

// Motion accents
val Flare = Color(0xFFFF4A1C)   // ignitions, double-tap warmth
val Volt  = Color(0xFFC6FF3D)   // live signals, comet trails

// Chat bubbles
val BubbleIn  = Color(0xFF1C2330)
val BubbleOut = Color(0xFF1E3250)

// Text
val Bone = Color(0xFFF1EBE0)    // primary text (brand "bone")
val Dust = Color(0xFF8A8076)    // secondary text (brand "dust")
val Clay = Color(0xFFC4A882)    // receipts / timestamps

// Edge rail glass — #121820 at 92% opacity (spec: #121820EB)
val RailGlass = Color(0xEB121820)

// Utility
val Void = Color(0xFF0A0908)
