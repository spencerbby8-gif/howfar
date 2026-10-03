package io.howfar.app.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * The five destinations, top-to-bottom as they sit in the left edge rail.
 * No bottom navigation bar anywhere in this app. (README §2)
 */
enum class HowFarDestination(
    val route: String,
    val label: String,
    val icon: ImageVector,
) {
    HOME("home", "home", Icons.Filled.Home),
    NOW("now", "now", Icons.Filled.PlayArrow),
    CAMERA("camera", "camera", Icons.Filled.Add),
    ALERTS("alerts", "alerts", Icons.Filled.Notifications),
    PROFILE("profile", "profile", Icons.Filled.Person);

    companion object {
        fun fromRoute(route: String?) =
            entries.firstOrNull { it.route == route } ?: HOME
    }
}
