/**
 * Shared helper for mapping answer_payload to UI-friendly option state.
 * Supports both camelCase and snake_case (isCorrect/is_correct, correctAnswer/correct_answer).
 * Used by preview rendering and edit modal hydration.
 */

export interface OptionState {
  text: string;
  isCorrect: boolean;
}

type QuestionType = 'multiple-choice' | 'true-false';

/**
 * Convert answer_payload + question_type to options array for display/edit.
 * Returns undefined for unsupported types.
 */
export function answerPayloadToOptions(
  answerPayload: Record<string, unknown> | null | undefined,
  questionType: QuestionType
): OptionState[] | undefined {
  const payload = answerPayload ?? {};
  if (questionType !== 'multiple-choice' && questionType !== 'true-false') {
    return undefined;
  }

  if (questionType === 'multiple-choice') {
    const opts = (payload.options as Array<{
      text?: string;
      isCorrect?: boolean;
      is_correct?: boolean;
    }> | undefined) ?? [];
    if (opts.length === 0) return undefined;
    return opts.map((o) => ({
      text: o.text ?? '',
      isCorrect: (o as { isCorrect?: boolean; is_correct?: boolean }).isCorrect ??
        (o as { isCorrect?: boolean; is_correct?: boolean }).is_correct ??
        false,
    }));
  }

  if (questionType === 'true-false') {
    const opts = (payload.options as Array<{
      text?: string;
      isCorrect?: boolean;
      is_correct?: boolean;
    }> | undefined) ?? [];
    if (opts.length > 0) {
      return opts.map((o) => ({
        text: o.text ?? '',
        isCorrect: (o as { isCorrect?: boolean; is_correct?: boolean }).isCorrect ??
          (o as { isCorrect?: boolean; is_correct?: boolean }).is_correct ??
          false,
      }));
    }
    const correct = (payload as { correctAnswer?: boolean; correct_answer?: boolean }).correctAnswer ??
      (payload as { correctAnswer?: boolean; correct_answer?: boolean }).correct_answer;
    const cv = correct === true || correct === false ? correct : true;
    return [
      { text: 'True', isCorrect: cv === true },
      { text: 'False', isCorrect: cv === false },
    ];
  }

  return undefined;
}
