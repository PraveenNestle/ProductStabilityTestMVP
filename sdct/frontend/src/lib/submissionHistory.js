/**
 * Submission History Storage
 * Maintains a log of submitted observations for audit trail
 * File: sdct/frontend/src/lib/submissionHistory.js
 */

const KEY_SUBMISSIONS = 'sdct.submissions.v1';
const MAX_HISTORY = 100; // Keep last 100 submissions

/**
 * Record a successful submission
 */
export function recordSubmission(doc, files = []) {
  try {
    const submissions = getSubmissions();
    
    const submission = {
      observationId: doc.observationId,
      context: doc.context,
      submittedAt: doc.submittedAt,
      overallResult: doc.overallResult,
      fieldCount: doc.values.length,
      mediaCount: files.length || doc.media?.length || 0,
      status: doc.status,
      recordedAt: new Date().toISOString()
    };
    
    // Add to front of array
    submissions.unshift(submission);
    
    // Keep only last N submissions
    const trimmed = submissions.slice(0, MAX_HISTORY);
    
    localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(trimmed));
    
    return { success: true, submission, total: trimmed.length };
  } catch (error) {
    console.error('Failed to record submission:', error);
    return { error: error.message };
  }
}

/**
 * Get all submission records
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(KEY_SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to read submissions:', error);
    return [];
  }
}

/**
 * Get submission by ID
 */
export function getSubmission(observationId) {
  try {
    const submissions = getSubmissions();
    return submissions.find(s => s.observationId === observationId);
  } catch (error) {
    console.error('Failed to find submission:', error);
    return null;
  }
}

/**
 * Get submissions for a specific sample
 */
export function getSubmissionsForSample(sampleCode) {
  try {
    const submissions = getSubmissions();
    return submissions.filter(s => s.context?.sampleCode === sampleCode);
  } catch (error) {
    console.error('Failed to find submissions for sample:', error);
    return [];
  }
}

/**
 * Clear submission history
 */
export function clearSubmissions() {
  try {
    localStorage.removeItem(KEY_SUBMISSIONS);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Get summary statistics
 */
export function getSubmissionStats() {
  try {
    const submissions = getSubmissions();
    
    if (submissions.length === 0) {
      return { total: 0, byResult: {} };
    }
    
    const stats = {
      total: submissions.length,
      byResult: {},
      byProject: {},
      lastSubmitted: submissions[0]?.recordedAt,
      firstSubmitted: submissions[submissions.length - 1]?.recordedAt
    };
    
    submissions.forEach(s => {
      // Count by result
      const result = s.overallResult || 'UNKNOWN';
      stats.byResult[result] = (stats.byResult[result] || 0) + 1;
      
      // Count by project
      const project = s.context?.projectCode || 'UNKNOWN';
      stats.byProject[project] = (stats.byProject[project] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Failed to calculate stats:', error);
    return { total: 0, byResult: {}, byProject: {} };
  }
}

/**
 * Export submission history as JSON
 */
export function exportSubmissionHistory() {
  try {
    const submissions = getSubmissions();
    const stats = getSubmissionStats();
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      submissions: submissions,
      statistics: stats
    };
    
    return exportData;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Make available in window for console debugging
 */
if (typeof window !== 'undefined') {
  window.SubmissionHistory = {
    recordSubmission,
    getSubmissions,
    getSubmission,
    getSubmissionsForSample,
    clearSubmissions,
    getSubmissionStats,
    exportSubmissionHistory
  };
}
