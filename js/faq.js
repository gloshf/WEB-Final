(function ($) {
    'use strict';

    $(function () {
        const $questions = $('.mv-faq-question');

        if (!$questions.length) return;

        $('.mv-faq-answer').hide();

        $questions.on('click', function () {
            const $question = $(this);

            const isOpening =
                $question.attr('aria-expanded') !== 'true';

            const $answer = $('#' + $question.attr('aria-controls'));

            // Close other FAQ answers.
            $questions.not($question).each(function () {
                const $other = $(this);

                $other.attr('aria-expanded', 'false');

                $other.find('.mv-faq-indicator').text('+');

                $('#' + $other.attr('aria-controls'))
                    .stop(true, true)
                    .slideUp(220);
            });

            $question.attr('aria-expanded', String(isOpening));

            $question.find('.mv-faq-indicator')
                .text(isOpening ? '−' : '+');

            // Open or close the selected answer.
            $answer.stop(true, true).slideToggle(240);
        });
    });

})(window.jQuery);