package io.howfar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.howfar.app.ui.components.Avatar
import io.howfar.app.ui.theme.Accent
import io.howfar.app.ui.theme.Bone
import io.howfar.app.ui.theme.Card
import io.howfar.app.ui.theme.Clay
import io.howfar.app.ui.theme.Dust
import io.howfar.app.ui.theme.Field
import io.howfar.app.ui.theme.Flare
import io.howfar.app.ui.theme.Stroke
import io.howfar.app.ui.theme.Volt

/** CAMERA — photo still (kept 48h) or 15s moment. CameraX lands per spec §2.1. */
@Composable
fun CameraScreen(modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = modifier.fillMaxSize().padding(start = 80.dp, end = 24.dp),
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(360.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Field)
                .border(1.dp, Stroke, RoundedCornerShape(24.dp)),
        ) {
            Text("camerax viewfinder\n(spec §2.1)", color = Dust, fontSize = 13.sp, lineHeight = 18.sp)
        }
        Spacer(Modifier.height(22.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
            CapturePill("still · 48h", Stroke)
            CapturePill("15s moment", Flare)
        }
    }
}

@Composable
private fun CapturePill(label: String, ring: androidx.compose.ui.graphics.Color) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(99.dp))
            .background(Card)
            .border(1.dp, ring, RoundedCornerShape(99.dp))
            .padding(horizontal = 16.dp, vertical = 10.dp),
    ) {
        Box(Modifier.size(10.dp).clip(CircleShape).background(ring))
        Spacer(Modifier.width(8.dp))
        Text(label, color = Bone, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
    }
}

/** ALERTS — three kinds ever, zero red badges. */
@Composable
fun AlertsScreen(modifier: Modifier = Modifier) {
    val alerts = listOf(
        Triple(Flare, "flares", "8 people left warmth on your rumuokoro post"),
        Triple(Volt, "replies", "kelechi answered from 1.4 km away"),
        Triple(Accent, "milestones", "your post reached accra — 966 km traveled"),
    )
    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = modifier.fillMaxSize().padding(start = 80.dp, end = 16.dp, top = 16.dp),
    ) {
        Text("alerts", color = Bone, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
        Spacer(Modifier.height(6.dp))
        alerts.forEach { (color, title, body) ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(Card)
                    .border(1.dp, Stroke, RoundedCornerShape(14.dp))
                    .padding(14.dp),
            ) {
                Box(Modifier.size(10.dp).clip(CircleShape).background(color))
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(title, color = Bone, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    Text(body, color = Dust, fontSize = 12.sp)
                }
            }
        }
        Text("nothing else will ever live on this screen", color = Clay, fontSize = 11.sp)
    }
}

/** PROFILE — the ground. Private stats only; no follower number exists. */
@Composable
fun ProfileScreen(modifier: Modifier = Modifier) {
    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(start = 80.dp, end = 16.dp, top = 16.dp, bottom = 24.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Avatar(initial = 's', color = Accent, size = 56)
            Spacer(Modifier.width(12.dp))
            Column {
                Text("spencer", color = Bone, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Text("@spencerbby · port harcourt", color = Clay, fontSize = 12.sp)
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatCard("12,847", "km traveled"); StatCard("9", "cities reached"); StatCard("214", "flares kept")
        }

        Text("the ground", color = Bone, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
        StrataRow("today", 3, Stroke)
        StrataRow("this week", 11, Clay)
        StrataRow("this month", 26, Dust)
        StrataRow("deep ground", 84, Flare)

        Text("reach map", color = Bone, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(150.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(Field)
                .border(1.dp, Stroke, RoundedCornerShape(14.dp)),
        ) {
            Text("port harcourt → lagos → accra → london", color = Dust, fontSize = 12.sp)
        }
    }
}

@Composable
private fun StatCard(value: String, label: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Card)
            .border(1.dp, Stroke, RoundedCornerShape(14.dp))
            .padding(horizontal = 16.dp, vertical = 12.dp),
    ) {
        Text(value, color = Bone, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
        Text(label, color = Dust, fontSize = 10.sp)
    }
}

@Composable
private fun StrataRow(title: String, count: Int, color: androidx.compose.ui.graphics.Color) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Card)
            .border(1.dp, Stroke, RoundedCornerShape(12.dp))
            .padding(horizontal = 14.dp, vertical = 12.dp),
    ) {
        Box(Modifier.size(8.dp).clip(CircleShape).background(color))
        Spacer(Modifier.width(10.dp))
        Text(title, color = Bone, fontSize = 14.sp)
        Spacer(Modifier.weight(1f))
        Text("$count moments", color = Dust, fontSize = 12.sp)
    }
}
