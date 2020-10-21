var setUpRefusalsWizard = function () {
    var $form = $(this);

    $('input', $form).on('change', function () {
        showOrHideDependents(
            $(this).attr('name'),
            $(this).val()
        );
    });
};

var showOrHideDependents = function (id, value) {
    var dependents = $('[data-showif-id="' + id + '"]');

    dependents.each(function () {
        var $dependent = $(this);
        var show = false;
        var showif_operator = $dependent.attr('data-showif-operator');
        var showif_value = $dependent.attr('data-showif-value');
        var suggestion_type = $dependent.attr('data-suggestion-type');

        // Work out whether to show or hide.
        if ( showif_operator === 'is' ) {
            show = ( value === showif_value );
        } else if ( showif_operator === 'is not' ) {
            show = ( value !== showif_value );
        }

        // Work out whether this is a question or a next step.
        if ( suggestion_type ) {
            showOrHidesuggestion( $dependent, show );
        } else {
            showOrHideQuestion( $dependent, show );
        }
    });
};

var showOrHideQuestion = function ( $question, show ) {
    var $options = $question.find('input[type="radio"]');

    if ( show ) {
        $question.collapse('show');
    } else {
        $question.collapse('hide');
        $options.prop('checked', false);
    }

    // Recurse through dependencies, updating visibility and selections.
    if ( $options.length ) {
        var option_value = $options.filter(':selected').val() || null;
        showOrHideDependents(
            $question.attr('data-question-id'),
            option_value
        );
    }
}

var showOrHidesuggestion = function ( $suggestion, show ) {
    // Next steps are a little more complicated than regular questions,
    // as they are collected in groups by type, and the entire group
    // needs to be shown/hidden based on the number of visible next steps.
    var suggestion_type = $suggestion.attr('data-suggestion-type');
    var $parent = $suggestion.parent();
    var $visiblesiblings = $suggestion.siblings('.js-refusals-wizard-suggestion.show');

    if ( show ) {
        var $input = $('<input>').attr({
            type: 'hidden',
            name: 'response_template[]',
            value: $suggestion.attr('data-suggestion-reponse-template')
        });
        $input.appendTo( $suggestion );
        if ( $visiblesiblings.length === 0 ) {
            $parent.collapse('show');
            $('.js-default-suggestion[data-suggestion-type="' + suggestion_type + '"]').collapse('hide');
        }
        $suggestion.collapse('show');
    } else {
        $suggestion.find('input[type="hidden"]').remove();
        if ( $visiblesiblings.length === 0 ) {
            $parent.collapse('hide');
            $('.js-default-suggestion[data-suggestion-type="' + suggestion_type + '"]').collapse('show');
        }
        $suggestion.collapse('hide');
    }
}

var setUpRefusalsChatbot = function () {
    var $form = $(this);

    $form.on('submit', function (e) {
        e.preventDefault();
        var $current = $('.js-chatbot-question:visible');
        var $next = $current.next('.js-chatbot-question');

        if ( $next.length ) {
            $current.addClass('d-none');
            $next.removeClass('d-none');
        }

        if ( $current.is('[data-question-id="does-calculation-include-wrong-things"]') ) {
            $('.js-chatbot-finale-hide').collapse('hide');
            $('.js-chatbot-finale-show').collapse('show');
        }
    });
};

$(function () {
    $('.js-refusals-wizard').each(setUpRefusalsWizard);
    $('.js-refusals-chatbot').each(setUpRefusalsChatbot);
});
