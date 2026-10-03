package io.howfar.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * Typography. Brand fonts are Unbounded (display) and Manrope (body).
 * TODO: drop unbounded_extrabold.ttf and manrope_*.ttf into res/font and
 * swap FontFamily.Default for FontFamily(R.font.unbounded_extrabold).
 */
val DisplayFont = FontFamily.Default
val BodyFont = FontFamily.Default

val HowFarTypography = Typography(
    // "how far" wordmark + screen headers — brand law: lowercase
    displayMedium = TextStyle(
        fontFamily = DisplayFont,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        color = Bone,
    ),
    titleLarge = TextStyle(
        fontFamily = DisplayFont,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        color = Bone,
    ),
    bodyLarge = TextStyle(
        fontFamily = BodyFont,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 22.sp,
        color = Bone,
    ),
    bodyMedium = TextStyle(
        fontFamily = BodyFont,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = Bone,
    ),
    // Receipts: "📍 port harcourt · 2 min ago · 1.4 km"
    labelSmall = TextStyle(
        fontFamily = BodyFont,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 14.sp,
        color = Clay,
    ),
)
