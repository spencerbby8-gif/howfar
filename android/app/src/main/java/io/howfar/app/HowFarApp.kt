package io.howfar.app

import android.app.Application
import androidx.room.Room
import io.howfar.app.data.db.HowFarDatabase

class HowFarApp : Application() {

    lateinit var database: HowFarDatabase
        private set

    override fun onCreate() {
        super.onCreate()
        database = Room.databaseBuilder(
            applicationContext,
            HowFarDatabase::class.java,
            "howfar.db",
        ).build()
        // TODO: schedule DistanceSyncWorker (15-min sweep, spec §4)
    }
}
