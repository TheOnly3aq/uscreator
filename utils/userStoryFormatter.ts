import { UserStoryData } from '@/types/userStory';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

/**
 * Converts HTML to markdown, preserving formatting and lists
 */
function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) {
    return '';
  }
  if (html.includes('<')) {
    return turndownService.turndown(html).trim();
  }
  return html.trim();
}

/**
 * Formats user story data into a formatted string for copying
 */
export function formatUserStory(data: UserStoryData): string {
  const parts: string[] = [];

  parts.push('**As a** ' + (data.role || ''));
  parts.push('**I want** ' + (data.action || ''));
  parts.push('**So that** ' + (data.benefit || ''));
  parts.push('');

  if (data.background && data.background.trim()) {
    const backgroundMarkdown = htmlToMarkdown(data.background);
    if (backgroundMarkdown) {
      parts.push('**Background/Context:**');
      parts.push('');
      parts.push(backgroundMarkdown);
      parts.push('');
    }
  }

  if (data.acceptanceCriteria && data.acceptanceCriteria.length > 0) {
    const validCriteria = data.acceptanceCriteria.filter(
      (item) => item && item.trim()
    );
    if (validCriteria.length > 0) {
      parts.push('**Acceptance Criteria**');
      parts.push('');
      validCriteria.forEach((criterion) => {
        parts.push(`- ${criterion.trim()}`);
      });
      parts.push('');
    }
  }

  if (data.technicalInfo && data.technicalInfo.length > 0) {
    const validTechnicalInfo = data.technicalInfo.filter(
      (item) => item && item.trim()
    );
    if (validTechnicalInfo.length > 0) {
      parts.push('**Technical Information**');
      parts.push('');
      validTechnicalInfo.forEach((info) => {
        parts.push(`- ${info.trim()}`);
      });
    }
  }

  return parts.join('\n');
}

