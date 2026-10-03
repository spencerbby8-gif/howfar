package io.howfar.app.data.model

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import io.howfar.app.ui.theme.Card
import io.howfar.app.ui.theme.Flare
import io.howfar.app.ui.theme.Field
import io.howfar.app.ui.theme.Stroke
import io.howfar.app.ui.theme.Volt

/**
 * UI-time models + local mock set. Wire to Room (spec §3) once the sync
 * pipeline exists; the mock set is what the v9 prototype ships with —
 * Port Harcourt, Warri, Lagos, Enugu, Accra, London.
 */
data class MockPost(
    val id: String,
    val authorHandle: String,
    val avatarColor: Color,
    val originCity: String,
    val minutesAgo: Long,
    val distanceKm: Double,
    val caption: String,
    val mediaBrush: Brush,
    val reactions: List<Pair<String, String>>, // (handle, emoji) floating bubbles
    val comments: List<MockComment>,
)

data class MockComment(val handle: String, val text: String)

private fun terrain(c1: Color, c2: Color): Brush =
    Brush.linearGradient(listOf(c1, c2, Field))

object MockFeed {

    val home: List<MockPost> = listOf(
        MockPost(
            id = "p1",
            authorHandle = "tunde",
            avatarColor = Flare,
            originCity = "port harcourt",
            minutesAgo = 2,
            distanceKm = 1.4,
            caption = "rumuokoro junction never sleeps",
            mediaBrush = terrain(Flare.copy(alpha = 0.5f), Card),
            reactions = listOf("kelechi" to "😂", "amara" to "🔥"),
            comments = listOf(
                MockComment("kelechi", "left this exact spot 20 minutes ago, wild"),
                MockComment("amara", "the suya man still dey there?"),
                MockComment("eze", "this is the energy"),
            ),
        ),
        MockPost(
            id = "p2",
            authorHandle = "amara",
            avatarColor = Volt,
            originCity = "warri",
            minutesAgo = 38,
            distanceKm = 142.0,
            caption = "tanker traffic turned the evening into a parking lot. still moving",
            mediaBrush = terrain(Volt.copy(alpha = 0.45f), Field),
            reactions = listOf("eze" to "🥁"),
            comments = listOf(
                MockComment("tunde", "warri traffic no dey ever carry last"),
                MockComment("nkem", "stay safe abeg"),
            ),
        ),
        MockPost(
            id = "p3",
            authorHandle = "chidi",
            avatarColor = Stroke,
            originCity = "lagos",
            minutesAgo = 190,
            distanceKm = 458.0,
            caption = "third mainland at dusk. the lagoon carried the whole sunset",
            mediaBrush = terrain(Color(0xFF3E4E60), Card),
            reactions = listOf("tunde" to "😍", "nkem" to "🙌"),
            comments = listOf(
                MockComment("amara", "frame this one"),
            ),
        ),
    )

    val far: List<MockPost> = listOf(
        MockPost(
            id = "f1",
            authorHandle = "yemisi",
            avatarColor = Flare,
            originCity = "london",
            minutesAgo = 480,
            distanceKm = 5266.0,
            caption = "first snow of the year and the whole street went quiet",
            mediaBrush = terrain(Color(0xFF5B5BA8), Card),
            reactions = listOf("tunde" to "❄️"),
            comments = listOf(MockComment("kelechi", "it traveled 5,266 km to get here")),
        ),
        MockPost(
            id = "f2",
            authorHandle = "kwame",
            avatarColor = Volt,
            originCity = "accra",
            minutesAgo = 320,
            distanceKm = 966.0,
            caption = "osu night market is fully awake",
            mediaBrush = terrain(Color(0xFFA45BA8).copy(alpha = 0.6f), Field),
            reactions = listOf("amara" to "🔥"),
            comments = listOf(MockComment("eze", "accra next december, god willing")),
        ),
    )
}
