var setUpRefusalsWizard = function () {
    var $form = $(this);

    $('input', $form).on('change', function () {
        showOrHideDependentQuestions(
            $(this).attr('name'),
            $(this).val()
        );
    });
};

var showOrHideDependentQuestions = function (id, value) {
    var dependent_questions = $('[data-showif-id="' + id + '"]');

    dependent_questions.each(function () {
        var $this_question = $(this);
        var show_this_question = false;
        var showif_operator = $this_question.attr('data-showif-operator');
        var showif_value = $this_question.attr('data-showif-value');
        var $options = $this_question.find('input[type="radio"]');

        if ( showif_operator === 'is' ) {
            show_this_question = ( value === showif_value );
        } else if ( showif_operator === 'is not' ) {
            show_this_question = ( value !== showif_value );
        }

        // Show or hide this question.
        // And if hidden, reset any selections.
        if ( show_this_question ) {
            $this_question.collapse('show');
        } else {
            $this_question.collapse('hide');
            $options.prop('checked', false);
        }

        // Recurse through dependencies, updating visibility and selections.
        if ( $options.length ) {
            var option_value = $options.filter(':selected').val() || null;
            showOrHideDependentQuestions(
                $this_question.attr('data-question-id'),
                option_value
            );
        }
    });
};

$(function () {
    $('.js-refusals-wizard').each(setUpRefusalsWizard);
});
