package io.howfar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.howfar.app.data.DistanceEngine
import io.howfar.app.data.model.MockFeed
import io.howfar.app.ui.components.FeedCard
import io.howfar.app.ui.theme.Accent
import io.howfar.app.ui.theme.Bone
import io.howfar.app.ui.theme.Dust
import io.howfar.app.ui.theme.Field
import io.howfar.app.ui.theme.Volt

/**
 * NOW — "what is happening near me right now."
 * Near (≤50 km) vs Far (>50 km). Zero ranking; only distance and time.
 * Entering this tab collapses the left rail automatically (auto-immersion).
 */
@Composable
fun NowScreen(modifier: Modifier = Modifier) {
    var scope by remember { mutableStateOf(DistanceEngine.Scope.NEAR) }
    val feed = if (scope == DistanceEngine.Scope.NEAR) MockFeed.home + MockFeed.home else MockFeed.far

    LazyColumn(
        contentPadding = PaddingValues(start = 34.dp, end = 12.dp, top = 14.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = modifier.fillMaxSize(),
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("now", color = Bone, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.weight(1f))
                ScopeToggle(scope) { scope = it }
                Spacer(Modifier.padding(start = 46.dp)) // clearance for the handle
            }
            Spacer(Modifier.height(10.dp))
            Text(
                if (scope == DistanceEngine.Scope.NEAR) "live within 50 km of you"
                else "how far these traveled to reach you",
                color = Dust, fontSize = 12.sp,
            )
            Spacer(Modifier.height(6.dp))
        }
        items(feed, key = { it.id + scope }) { post ->
            FeedCard(post = post)
        }
    }
}

@Composable
private fun ScopeToggle(current: DistanceEngine.Scope, onChange: (DistanceEngine.Scope) -> Unit) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(99.dp))
            .background(Field)
            .padding(3.dp),
    ) {
        DistanceEngine.Scope.entries.forEach { scope ->
            val selected = scope == current
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .clip(RoundedCornerShape(99.dp))
                    .background(if (selected) Accent else androidx.compose.ui.graphics.Color.Transparent)
                    .clickable { onChange(scope) }
                    .padding(horizontal = 14.dp, vertical = 6.dp),
            ) {
                Text(
                    text = if (scope == DistanceEngine.Scope.NEAR) "near" else "far",
                    color = if (selected) Bone else Dust,
                    fontSize = 12.sp,
                    fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
                )
            }
        }
    }
}
