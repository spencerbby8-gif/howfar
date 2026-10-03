package io.howfar.app.data.db

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase

/**
 * Local-first persistence (spec §3). The device database is the source of
 * truth for anything the user created — sync is opportunistic, an offline
 * write always succeeds.
 */

@Entity(tableName = "posts")
data class PostEntity(
    @PrimaryKey val id: String,
    val authorId: String,
    val authorName: String,
    val originCity: String,
    val originLat: Double,
    val originLng: Double,
    val distanceKm: Double,
    val timestamp: Long,
    val mediaUrl: String,
    val mediaType: String, // STILL, MOMENT, TEXT — stills live 48h, no fuse
    val caption: String,
    val replyCount: Int,
    val isFlaredByMe: Boolean,
)

@Entity(tableName = "video_reactions")
data class VideoReactionEntity(
    @PrimaryKey val id: String,
    val postId: String,
    val authorId: String,
    val authorName: String,
    val emoji: String,
    val videoUrl: String,
    val durationMs: Long,
    val timestamp: Long,
)

@Entity(tableName = "comments")
data class CommentEntity(
    @PrimaryKey val id: String,
    val postId: String,
    val authorId: String,
    val authorName: String,
    val contentText: String?,
    val voiceUrl: String?,
    val timestamp: Long,
)

/** Flares are private warmth. UNIQUE(postId, userId) — one per person, no public count. */
@Entity(tableName = "flares")
data class FlareEntity(
    @PrimaryKey val id: String,
    val postId: String,
    val userId: String,
    val timestamp: Long,
)

@Dao
interface PostDao {
    @Query("SELECT * FROM posts ORDER BY timestamp DESC")
    suspend fun allByRecency(): List<PostEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(post: PostEntity)

    @Query("SELECT * FROM posts WHERE distanceKm <= :radiusKm ORDER BY timestamp DESC LIMIT :limit")
    suspend fun near(radiusKm: Double, limit: Int = 50): List<PostEntity>

    @Query("SELECT * FROM posts WHERE distanceKm > :radiusKm ORDER BY distanceKm DESC LIMIT :limit")
    suspend fun traveled(radiusKm: Double, limit: Int = 50): List<PostEntity>
}

@Database(
    entities = [PostEntity::class, VideoReactionEntity::class, CommentEntity::class, FlareEntity::class],
    version = 1,
    exportSchema = false,
)
abstract class HowFarDatabase : RoomDatabase() {
    abstract fun postDao(): PostDao
}
