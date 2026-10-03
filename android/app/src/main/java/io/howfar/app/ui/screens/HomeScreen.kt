package io.howfar.app.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.howfar.app.data.model.MockFeed
import io.howfar.app.ui.components.FeedCard
import io.howfar.app.ui.theme.Accent
import io.howfar.app.ui.theme.Bone
import io.howfar.app.ui.theme.Dust
import io.howfar.app.ui.theme.Flare
import io.howfar.app.ui.theme.Stroke
import io.howfar.app.ui.theme.Volt

/** HOME — orbit-ring stories row on top, feed of cards below. */
@Composable
fun HomeScreen(modifier: Modifier = Modifier) {
    LazyColumn(
        contentPadding = PaddingValues(start = 80.dp, end = 12.dp, top = 14.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = modifier.fillMaxSize(),
    ) {
        item {
            Text("how far", color = Bone, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(10.dp))
            StoriesRow()
            Spacer(Modifier.height(6.dp))
        }
        items(MockFeed.home, key = { it.id }) { post ->
            FeedCard(post = post)
        }
    }
}

private data class StoryUi(val name: String, val isMoment: Boolean /* moment = fuse; still = 48h kept */)

@Composable
private fun StoriesRow() {
    val stories = listOf(
        StoryUi("you", false),
        StoryUi("tunde", true),
        StoryUi("amara", true),
        StoryUi("kelechi", false),
        StoryUi("eze", true),
    )
    LazyRow(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
        items(stories) { story ->
            StoryCircle(story)
        }
    }
}

@Composable
private fun StoryCircle(story: StoryUi) {
    // The fuse: a halo ring burning down for moments.
    // Stills rule (locked): NO fuse — photos are kept for 48 hours.
    var fuseBurn by remember(story.isMoment) { mutableFloatStateOf(0.72f) }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(62.dp)
                .pointerInput(story.name) {
                    detectTapGestures {
                        if (story.isMoment) fuseBurn = (fuseBurn - 0.15f).coerceAtLeast(0.05f)
                    }
                },
        ) {
            Canvas(Modifier.fillMaxSize()) {
                if (story.isMoment) {
                    // Halo fuse arc — burns from full circle downward.
                    drawArc(
                        color = Accent,
                        startAngle = -90f,
                        sweepAngle = 360f * fuseBurn,
                        useCenter = false,
                        style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round),
                    )
                } else {
                    // Kept still — quiet full ring, no timer.
                    drawCircle(
                        color = Stroke,
                        style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round),
                    )
                }
            }
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            listOf(
                                if (story.isMoment) Flare.copy(alpha = 0.8f) else Dust.copy(alpha = 0.5f),
                                Color(0xFF141210),
                            )
                        )
                    )
                    .border(1.dp, Stroke, CircleShape),
            ) {
                Text(
                    story.name.first().uppercase(),
                    color = Bone,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                )
            }
        }
        Spacer(Modifier.height(4.dp))
        Text(story.name, color = if (story.isMoment) Bone else Dust, fontSize = 10.sp)
    }
}
