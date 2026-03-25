package com.teamthree.legalaid.analytics.repository;

import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Dedicated repository for analytics queries.
 * All queries return Object[] rows: [label (String), count (Long)].
 */
@Repository
public interface AnalyticsRepository extends JpaRepository<Case, Long> {

    // ─── Cases by Category ────────────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(c.category, 'Unknown') AS category, COUNT(*) AS cnt
        FROM cases c
        GROUP BY category
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> countCasesByCategory();

    // ─── Cases by Status ──────────────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(c.status, 'Unknown') AS status, COUNT(*) AS cnt
        FROM cases c
        GROUP BY status
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> countCasesByStatus();

    // ─── Cases by Location ────────────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(c.location, 'Unknown') AS location, COUNT(*) AS cnt
        FROM cases c
        WHERE c.location IS NOT NULL AND c.location != ''
        GROUP BY location
        ORDER BY cnt DESC
        LIMIT 20
        """, nativeQuery = true)
    List<Object[]> countCasesByLocation();

    // ─── New cases per month (last 12 months) ─────────────────────────────────
    @Query(value = """
        SELECT TO_CHAR(DATE_TRUNC('month', c.created_at), 'YYYY-MM') AS period,
               COUNT(*) AS cnt
        FROM cases c
        WHERE c.created_at >= NOW() - INTERVAL '12 months'
        GROUP BY period
        ORDER BY period ASC
        """, nativeQuery = true)
    List<Object[]> countNewCasesMonthly();

    // ─── New users per month (last 12 months) ─────────────────────────────────
    @Query(value = """
        SELECT TO_CHAR(DATE_TRUNC('month', u.created_at), 'YYYY-MM') AS period,
               COUNT(*) AS cnt
        FROM users u
        WHERE u.created_at >= NOW() - INTERVAL '12 months'
        GROUP BY period
        ORDER BY period ASC
        """, nativeQuery = true)
    List<Object[]> countNewUsersMonthly();

    // ─── New matches per month (last 12 months) ───────────────────────────────
    @Query(value = """
        SELECT TO_CHAR(DATE_TRUNC('month', m.created_at), 'YYYY-MM') AS period,
               COUNT(*) AS cnt
        FROM match m
        WHERE m.created_at >= NOW() - INTERVAL '12 months'
        GROUP BY period
        ORDER BY period ASC
        """, nativeQuery = true)
    List<Object[]> countNewMatchesMonthly();

    // ─── Matches by status ────────────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(m.status, 'Unknown') AS status, COUNT(*) AS cnt
        FROM match m
        GROUP BY status
        """, nativeQuery = true)
    List<Object[]> countMatchesByStatus();

    // ─── Matches by profileType ───────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(m.profile_type, 'Unknown') AS profile_type, COUNT(*) AS cnt
        FROM match m
        GROUP BY profile_type
        """, nativeQuery = true)
    List<Object[]> countMatchesByProfileType();

    // ─── Appointments per month ───────────────────────────────────────────────
    @Query(value = """
        SELECT TO_CHAR(DATE_TRUNC('month', a.created_at), 'YYYY-MM') AS period,
               COUNT(*) AS cnt
        FROM appointments a
        WHERE a.created_at >= NOW() - INTERVAL '12 months'
        GROUP BY period
        ORDER BY period ASC
        """, nativeQuery = true)
    List<Object[]> countAppointmentsMonthly();

    // ─── Messages per month ───────────────────────────────────────────────────
    @Query(value = """
    	    SELECT TO_CHAR(DATE_TRUNC('month', msg.timestamp), 'YYYY-MM') AS period,
    	           COUNT(*) AS cnt
    	    FROM messages msg
    	    WHERE msg.timestamp >= NOW() - INTERVAL '12 months'
    	    GROUP BY period
    	    ORDER BY period ASC
    	    """, nativeQuery = true)
    	List<Object[]> countMessagesMonthly();

    // ─── Lawyer locations ─────────────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(lp.location, 'Unknown') AS location, COUNT(*) AS cnt
        FROM lawyer_profiles lp
        WHERE lp.location IS NOT NULL AND lp.location != ''
        GROUP BY location
        ORDER BY cnt DESC
        LIMIT 20
        """, nativeQuery = true)
    List<Object[]> countLawyersByLocation();

    // ─── NGO locations ────────────────────────────────────────────────────────
    @Query(value = """
        SELECT COALESCE(np.location, 'Unknown') AS location, COUNT(*) AS cnt
        FROM ngo_profiles np
        WHERE np.location IS NOT NULL AND np.location != ''
        GROUP BY location
        ORDER BY cnt DESC
        LIMIT 20
        """, nativeQuery = true)
    List<Object[]> countNgosByLocation();

    // ─── Cases that have at least one match ────────────────────────────────────
    @Query(value = """
        SELECT COUNT(DISTINCT m.case_id) FROM match m
        """, nativeQuery = true)
    Long countMatchedCases();

    // ─── Active chats (distinct match conversations) ──────────────────────────
    @Query(value = """
        SELECT COUNT(DISTINCT msg.match_id) FROM messages msg
        """, nativeQuery = true)
    Long countActiveChats();
}
