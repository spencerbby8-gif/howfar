package io.howfar.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

/** HowFar is dark-only. There is no light theme — the void is part of the brand. */
private val DarkScheme = darkColorScheme(
    primary = Accent,
    onPrimary = Bone,
    secondary = Flare,
    tertiary = Volt,
    background = Bg,
    onBackground = Bone,
    surface = Card,
    onSurface = Bone,
    surfaceVariant = Field,
    outline = Stroke,
)

@Composable
fun HowFarTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkScheme,
        typography = HowFarTypography,
        content = content,
    )
}
