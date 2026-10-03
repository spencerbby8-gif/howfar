package io.howfar.app.data

import java.util.Locale
import kotlin.math.asin
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * The Distance Engine (BACKEND-AND-INFRASTRUCTURE-SPEC §3, ANDROID-NATIVE-SPEC §4).
 *
 * Distribution is physics, not engagement. There is no ranking model here —
 * only geography and time.
 */
object DistanceEngine {

    const val NEAR_RADIUS_KM = 50.0

    /**
     * Haversine great-circle distance in kilometres.
     *
     * Δd = 2R · arcsin( √(sin²(Δφ/2) + cos φ1 · cos φ2 · sin²(Δλ/2)) )
     */
    fun distanceKm(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Double {
        val r = 6371.0
        val dLat = Math.toRadians(lat2 - lat1)
        val dLng = Math.toRadians(lng2 - lng1)
        val a = sin(dLat / 2).pow(2) +
            cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLng / 2).pow(2)
        return 2 * r * asin(sqrt(a))
    }

    /** NEAR: Δd ≤ 50 km · FAR: Δd > 50 km. */
    fun scopeOf(distanceKm: Double): Scope =
        if (distanceKm <= NEAR_RADIUS_KM) Scope.NEAR else Scope.FAR

    enum class Scope { NEAR, FAR }

    /**
     * The receipt. Provenance as copy, always lowercase:
     * "📍 port harcourt · 2 min ago · 1.4 km"
     */
    fun formatReceipt(city: String, minutesAgo: Long, distanceKm: Double): String {
        val age = when {
            minutesAgo < 60 -> "$minutesAgo min ago"
            minutesAgo < 60 * 24 -> "${minutesAgo / 60}h ago"
            else -> "${minutesAgo / (60 * 24)}d ago"
        }
        val km = if (distanceKm < 100) {
            String.format(Locale.US, "%.1f km", distanceKm)
        } else {
            String.format(Locale.US, "%,.0f km", distanceKm)
        }
        return "📍 ${city.lowercase()} · $age · $km"
    }
}
