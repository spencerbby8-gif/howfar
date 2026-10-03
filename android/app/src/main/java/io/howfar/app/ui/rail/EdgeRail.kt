package io.howfar.app.ui.rail

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import io.howfar.app.navigation.HowFarDestination
import io.howfar.app.ui.theme.Accent
import io.howfar.app.ui.theme.Bone
import io.howfar.app.ui.theme.Dust
import io.howfar.app.ui.theme.RailGlass
import kotlinx.coroutines.launch

private val FULL_WIDTH = 68.dp
private val HANDLE_WIDTH = 20.dp
private const val JOG_THRESHOLD_PX = 120f

/**
 * The left edge rail (README §2). Five destinations, translucent glass,
 * a collapse chevron shrinking it to a 20dp drag handle, and a jog dial:
 * flicking up/down on the rail rotates the tab selection like a spring
 * dial — no precision aiming required with the thumb.
 */
@Composable
fun EdgeRail(
    current: HowFarDestination,
    expanded: Boolean,
    onSelect: (HowFarDestination) -> Unit,
    onExpandedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
) {
    val haptics = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val destinations = HowFarDestination.entries

    Box(modifier = modifier.zIndex(10f)) {
        if (expanded) {
            RailBody(
                destinations = destinations,
                current = current,
                onSelect = onSelect,
                onCollapse = { onExpandedChange(false) },
                onJog = { delta ->
                    val next = ((current.ordinal + delta) % destinations.size + destinations.size) % destinations.size
                    haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                    onSelect(destinations[next])
                },
            )
        } else {
            EdgeHandle(onRestore = { onExpandedChange(true) })
        }
    }
}

@Composable
private fun RailBody(
    destinations: List<HowFarDestination>,
    current: HowFarDestination,
    onSelect: (HowFarDestination) -> Unit,
    onCollapse: () -> Unit,
    onJog: (Int) -> Unit,
) {
    var dragAccumulator by remember { mutableFloatStateOf(0f) }

    Surface(
        color = RailGlass,
        shape = RoundedCornerShape(topEnd = 18.dp, bottomEnd = 18.dp),
        shadowElevation = 0.dp,
        modifier = Modifier
            .width(FULL_WIDTH)
            .fillMaxHeight()
            .pointerInput(Unit) {
                // Jog dial: vertical flicks rotate the selection.
                detectVerticalDragGestures(
                    onDragStart = { dragAccumulator = 0f },
                    onVerticalDrag = { _, dragAmount ->
                        dragAccumulator += dragAmount
                        when {
                            dragAccumulator > JOG_THRESHOLD_PX -> {
                                onJog(+1); dragAccumulator = 0f
                            }
                            dragAccumulator < -JOG_THRESHOLD_PX -> {
                                onJog(-1); dragAccumulator = 0f
                            }
                        }
                    },
                )
            },
    ) {
        Column(
            verticalArrangement = Arrangement.SpaceEvenly,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxSize(),
        ) {
            destinations.forEach { destination ->
                RailItem(
                    destination = destination,
                    active = destination == current,
                    onClick = { onSelect(destination) },
                )
            }
            // Collapse chevron — ">" pushes the rail away.
            Icon(
                imageVector = Icons.Filled.KeyboardArrowLeft,
                contentDescription = "collapse rail",
                tint = Dust,
                modifier = Modifier
                    .size(22.dp)
                    .pointerInput(Unit) { detectTapGestures { onCollapse() } },
            )
        }
    }
}

@Composable
private fun RailItem(
    destination: HowFarDestination,
    active: Boolean,
    onClick: () -> Unit,
) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .size(46.dp)
            .pointerInput(Unit) { detectTapGestures { onClick() } },
    ) {
        if (active) OrbitRing()
        Icon(
            imageVector = destination.icon,
            contentDescription = destination.label,
            tint = if (active) Bone else Dust,
            modifier = Modifier.size(22.dp),
        )
    }
}

/** The animated orbit ring the active tab wears (README §2). */
@Composable
private fun OrbitRing() {
    val transition = rememberInfiniteTransition(label = "orbit")
    val rotation by transition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "orbit-rotation",
    )

    Canvas(modifier = Modifier.size(44.dp)) {
        drawArc(
            brush = Brush.sweepGradient(listOf(Color.Transparent, Accent, Color.Transparent)),
            startAngle = rotation,
            sweepAngle = 240f,
            useCenter = false,
            style = Stroke(width = 2.5.dp.toPx(), cap = StrokeCap.Round),
            topLeft = Offset(3.dp.toPx(), 3.dp.toPx()),
            size = androidx.compose.ui.geometry.Size(
                size.width - 6.dp.toPx(),
                size.height - 6.dp.toPx(),
            ),
        )
    }
}

/** The 20dp edge handle; tap or swiping right restores the rail. */
@Composable
private fun EdgeHandle(onRestore: () -> Unit) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .width(HANDLE_WIDTH)
            .fillMaxHeight()
            .clip(RoundedCornerShape(topEnd = 14.dp, bottomEnd = 14.dp))
            .background(RailGlass)
            .pointerInput(Unit) {
                detectHorizontalDragGestures { _, dragAmount ->
                    if (dragAmount > 24f) onRestore()
                }
            }
            .pointerInput(Unit) { detectTapGestures { onRestore() } },
    ) {
        Icon(
            imageVector = Icons.Filled.KeyboardArrowRight,
            contentDescription = "expand rail",
            tint = Dust,
            modifier = Modifier.size(16.dp),
        )
    }
}
