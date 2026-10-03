package io.howfar.app.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.EaseOutCubic
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import io.howfar.app.ui.theme.Flare
import java.util.UUID

private const val FLARE_DURATION_MS = 620

/**
 * The flare: private creator warmth (README §1). Double-tap fires an expanding
 * radial ignition burst in #FF4A1C from the exact touch coordinates.
 * Flares are counted privately — there is no public flare number, ever.
 */
@Stable
class FlareState {
    internal val activeBursts = mutableStateListOf<FlareBurst>()
    internal var privateTally = 0
        private set

    fun ignite(origin: Offset) {
        privateTally++
        activeBursts += FlareBurst(id = UUID.randomUUID().toString(), origin = origin)
    }

    internal fun extinguish(id: String) {
        activeBursts.removeAll { it.id == id }
    }

    val keptCount: Int get() = privateTally
}

internal class FlareBurst(val id: String, val origin: Offset) {
    val progress = Animatable(0f)
}

@Composable
fun rememberFlareState(): FlareState = remember { FlareState() }

/** Draw layer — place on top of the content that accepts flares. */
@Composable
fun FlareLayer(state: FlareState, modifier: Modifier = Modifier) {
    Canvas(modifier = modifier.fillMaxSize()) {
        state.activeBursts.forEach { burst ->
            val p = burst.progress.value
            val alpha = (1f - p).coerceIn(0f, 1f)
            val maxRadius = size.minDimension * 0.55f
            val radius = maxRadius * (0.15f + 0.85f * p)

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Flare.copy(alpha = 0.85f * alpha),
                        Flare.copy(alpha = 0.35f * alpha),
                        Flare.copy(alpha = 0f),
                    ),
                    center = burst.origin,
                    radius = radius,
                ),
                center = burst.origin,
                radius = radius,
            )
        }
    }

    // Drive each burst's lifetime.
    state.activeBursts.forEach { burst ->
        LaunchedEffect(burst.id) {
            burst.progress.animateTo(
                targetValue = 1f,
                animationSpec = tween(FLARE_DURATION_MS, easing = EaseOutCubic),
            )
            state.extinguish(burst.id)
        }
    }
}
