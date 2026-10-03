package io.howfar.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import io.howfar.app.navigation.HowFarDestination
import io.howfar.app.ui.rail.EdgeRail
import io.howfar.app.ui.screens.AlertsScreen
import io.howfar.app.ui.screens.CameraScreen
import io.howfar.app.ui.screens.HomeScreen
import io.howfar.app.ui.screens.NowScreen
import io.howfar.app.ui.screens.ProfileScreen
import io.howfar.app.ui.theme.Bg
import io.howfar.app.ui.theme.HowFarTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            HowFarTheme {
                HowFarRoot()
            }
        }
    }
}

@Composable
fun HowFarRoot() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = HowFarDestination.fromRoute(backStackEntry?.destination?.route)

    var railExpanded by rememberSaveable { mutableStateOf(true) }

    // Auto-immersion: entering Now collapses the rail (README §2).
    LaunchedEffect(currentDestination) {
        railExpanded = currentDestination != HowFarDestination.NOW
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Bg)
            .safeDrawingPadding(),
    ) {
        NavHost(
            navController = navController,
            startDestination = HowFarDestination.HOME.route,
            modifier = Modifier.fillMaxSize(),
        ) {
            composable(HowFarDestination.HOME.route) { HomeScreen() }
            composable(HowFarDestination.NOW.route) { NowScreen() }
            composable(HowFarDestination.CAMERA.route) { CameraScreen() }
            composable(HowFarDestination.ALERTS.route) { AlertsScreen() }
            composable(HowFarDestination.PROFILE.route) { ProfileScreen() }
        }

        EdgeRail(
            current = currentDestination,
            expanded = railExpanded,
            onSelect = { destination ->
                if (destination != currentDestination) {
                    navController.navigate(destination.route) {
                        launchSingleTop = true
                        restoreState = true
                        popUpTo(HowFarDestination.HOME.route) { saveState = true }
                    }
                }
            },
            onExpandedChange = { railExpanded = it },
            modifier = Modifier.align(Alignment.CenterStart),
        )
    }
}
