package io.howfar.app.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.howfar.app.data.DistanceEngine
import io.howfar.app.data.model.MockComment
import io.howfar.app.data.model.MockPost
import io.howfar.app.ui.theme.Accent
import io.howfar.app.ui.theme.Bone
import io.howfar.app.ui.theme.Card
import io.howfar.app.ui.theme.Clay
import io.howfar.app.ui.theme.Dust
import io.howfar.app.ui.theme.Field
import io.howfar.app.ui.theme.Flare
import io.howfar.app.ui.theme.Stroke
import io.howfar.app.ui.theme.Volt
import kotlinx.coroutines.launch

/**
 * The feed card. Law: content is an object you handle.
 *
 * • Drag up toward center  → card docks at scale(0.92) + blur(12dp),
 *   comments cascade in from BEHIND (40ms stagger). Drag down restores.
 * • Double-tap             → flare ignition at touch coordinates.
 * • Long-press             → object inspection: mute, receipt, provenance.
 */
@Composable
fun FeedCard(
    post: MockPost,
    modifier: Modifier = Modifier,
) {
    val scope = rememberCoroutineScope()
    val flareState = rememberFlareState()
    val dockProgress = remember { Animatable(0f) }
    var inspectOpen by remember { mutableStateOf(false) }
    var pipReaction by remember { mutableStateOf<String?>(null) }

    Box(modifier = modifier.fillMaxWidth()) {
        // ---- Behind the card: the comments panel ----------------------------
        CommentsPanel(
            comments = post.comments,
            progress = dockProgress.value,
            modifier = Modifier.fillMaxWidth().padding(top = 32.dp),
        )

        // ---- The card itself ------------------------------------------------
        CardSurface(
            post = post,
            flareState = flareState,
            pipReaction = pipReaction,
            onPipDismiss = { pipReaction = null },
            onPipOpen = { pipReaction = it },
            modifier = Modifier
                .fillMaxWidth()
                .graphicsLayer {
                    val p = dockProgress.value
                    scaleX = 1f - p * 0.08f      // dock at scale(0.92)
                    scaleY = 1f - p * 0.08f
                    translationY = -18 * p * density / 2.5f
                }
                .blur(if (dockProgress.value > 0.05f) (dockProgress.value * 12f).dp else 0.dp)
                .pointerInput(Unit) {
                    // Drag toward center = up on the card.
                    detectDragGestures(
                        onDragEnd = {
                            scope.launch {
                                val target = if (dockProgress.value > 0.42f) 1f else 0f
                                dockProgress.animateTo(target, tween(280))
                            }
                        },
                        onDrag = { change, dragAmount ->
                            change.consume()
                            val dampened = -dragAmount.y / 900f + dragAmount.x / 4000f
                            scope.launch {
                                dockProgress.snapTo(
                                    (dockProgress.value + dampened).coerceIn(0f, 1f)
                                )
                            }
                        },
                    )
                }
                .pointerInput(post.id) {
                    detectTapGestures(
                        onDoubleTap = { offset: Offset -> flareState.ignite(offset) },
                        onLongPress = { inspectOpen = true },
                    )
                },
        )
    }

    if (inspectOpen) {
        InspectSheet(post = post, onDismiss = { inspectOpen = false })
    }
}

@Composable
private fun CardSurface(
    post: MockPost,
    flareState: FlareState,
    pipReaction: String?,
    onPipOpen: (String) -> Unit,
    onPipDismiss: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Card)
            .border(1.dp, Stroke, RoundedCornerShape(14.dp)),
    ) {
        // Header — author + the receipt. No follower counts, ever.
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
        ) {
            Avatar(initial = post.authorHandle.first(), color = post.avatarColor)
            Spacer(Modifier.width(10.dp))
            Column {
                Text(
                    text = "@${post.authorHandle}",
                    color = Bone,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                )
                Text(
                    text = DistanceEngine.formatReceipt(post.originCity, post.minutesAgo, post.distanceKm),
                    color = Clay,
                    fontSize = 11.sp,
                )
            }
        }

        // Media — placeholder terrain gradient until CameraX pipeline lands.
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(4f / 5f)
                .background(post.mediaBrush),
        ) {
            FlareLayer(flareState)

            // Floating reaction bubbles — right edge (README §3.2)
            Column(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .padding(end = 10.dp),
            ) {
                post.reactions.forEach { (handle, emoji) ->
                    ReactionBubble(handle = handle, emoji = emoji, onClick = { onPipOpen(handle) })
                }
            }

            // Synced PiP overlay — 130dp x 190dp, accent stroke.
            if (pipReaction != null) {
                PipReactionOverlay(
                    handle = pipReaction,
                    onDismiss = onPipDismiss,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(12.dp),
                )
            }
        }

        // Caption
        if (post.caption.isNotEmpty()) {
            Text(
                text = post.caption,
                color = Bone,
                fontSize = 14.sp,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
            )
        }
    }
}

@Composable
private fun CommentsPanel(comments: List<MockComment>, progress: Float, modifier: Modifier = Modifier) {
    Column(
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(Field)
            .padding(horizontal = 12.dp, vertical = 14.dp)
            .alpha(progress.coerceIn(0f, 1f)),
    ) {
        Text("behind the post", color = Dust, fontSize = 11.sp)
        Spacer(Modifier.height(2.dp))
        comments.forEachIndexed { index, comment ->
            // 40ms cascade: each row lands a beat after the last.
            val rowAlpha = ((progress * (comments.size + 1.6f)) - 1f - index * 0.28f).coerceIn(0f, 1f)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .alpha(rowAlpha)
                    .graphicsLayer { translationY = (1f - rowAlpha) * 26f },
            ) {
                Avatar(initial = comment.handle.first(), color = Accent, size = 22)
                Spacer(Modifier.width(8.dp))
                Column {
                    Text("@${comment.handle}", color = Bone, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Text(comment.text, color = Dust, fontSize = 12.sp)
                }
            }
        }
        Text("drag down to fold back", color = Clay, fontSize = 11.sp)
    }
}

@Composable
private fun ReactionBubble(handle: String, emoji: String, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(Field)
                .border(1.dp, Stroke, CircleShape)
                .pointerInput(handle) { detectTapGestures { onClick() } },
        ) {
            Text(emoji, fontSize = 16.sp)
        }
        Text("@$handle", color = Dust, fontSize = 9.sp)
    }
}

@Composable
private fun PipReactionOverlay(handle: String, onDismiss: () -> Unit, modifier: Modifier = Modifier) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .size(width = 130.dp, height = 190.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Field)
            .border(2.dp, Accent, RoundedCornerShape(16.dp))
            .pointerInput(Unit) { detectTapGestures { onDismiss() } },
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("▶", color = Accent, fontSize = 22.sp)
            Spacer(Modifier.height(6.dp))
            Text("@$handle reacting", color = Bone, fontSize = 11.sp)
            Text("synced pip playback", color = Dust, fontSize = 9.sp)
        }
    }
}

@Composable
private fun InspectSheet(post: MockPost, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = { TextButton(onClick = onDismiss) { Text("done", color = Accent) } },
        title = { Text("inspect", color = Bone) },
        text = {
            Column {
                Text("• mute circle  — silence @${post.authorHandle}", color = Dust, fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))
                Text("• share distance receipt — ${post.distanceKm} km from ${post.originCity}", color = Dust, fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))
                Text("• provenance — captured in ${post.originCity}, honored by physics not ranking", color = Dust, fontSize = 14.sp)
            }
        },
        containerColor = Card,
        titleContentColor = Bone,
    )
}

@Composable
fun Avatar(initial: Char, color: androidx.compose.ui.graphics.Color, size: Int = 34) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(Brush.radialGradient(listOf(color, color.copy(alpha = 0.55f)))),
    ) {
        Text(initial.uppercaseChar().toString(), color = Bone, fontSize = (size * 0.42f).sp, fontWeight = FontWeight.Bold)
    }
}
