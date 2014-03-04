/**
 * Gumi v0.1
 * @usage $('sel').gumi()
 */

 ;(function($, window, document, undefined) {
  var defaults = {
    buttonClass: 'btn-default',
    dropdownClass: 'dropdown-default',
    onChange: function() {},
  };

  /**
   * @constructor
   */
  var Gumi = function(elem, options) {
    this.elem = elem;
    this.$elem = $(elem);

    // Reference to the button that shows the current selected option
    // and also handles the click event to show the dropdown
    this.$button = $('<button />');

    // Contains a reference to the dropdown list of options
    this.$dropdown = this.$elem.hide();

    // Native form select element that gumi links too
    this.$select = $('<select />');

    this.selectedIndex = 0;
    this.selectedLabel = undefined;
    this.selectedValue = undefined;

    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;

    this._init();
  };

  /**
   * Build out our Gumi prototype and methods
   */
  Gumi.prototype = {
    constructor: Gumi,

    /**
     * Initialize the Gumi selectbox
     */
    _init: function() {
      this._createSelect();
      this._createDropdown();
      this._bindDropdown();
      this._bindSelectOption();
    },

    /**
     * Creates a hidden "<select>" based on
     * the list items from the ul jQuery selector
     */
    _createSelect: function() {
      var that = this,
          selectedIndex = 0;

      // Copy some attributes over to our select
      this.$select
        .addClass(this.$elem.attr('class'))
        .hide();

      // Add the list options to our select options
      this.$elem.find('li').each(function(index) {
        var $self = $(this);

        var value = $self.html(),
            label = $self.data('label') || value;

        // Figure out which one should be selected by default
        if ($self.hasClass('selected')) {
          selectedIndex = index;
        }

        $('<option />')
          .val(value)
          .append(label)
          .addClass($self.attr('class'))
          .appendTo(that.$select);
      });

      // Set the default option
      this.setSelectedOption(selectedIndex);

      // Attach our native select to the DOM
      this.$elem.after(this.$select);
    },

    /**
     * Creates the clickable button to show
     * the dropdown, and attaches "optional"
     * custom classes to both the button and the dropdown
     */
    _createDropdown: function() {
      this.$button
        .html('<span>' + this.selectedLabel + '</span>')
        .addClass('gumi-btn')
        .addClass(this.options.buttonClass);

      // Insert the button before the dropdown
      this.$elem.before(this.$button);

      // Styling should hide the dropdown by default
      this.$dropdown
        .addClass('gumi-dropdown')
        .addClass(this.options.dropdownClass);
    },

    /**
     * Handle the interaction for showing and hiding the dropdown options
     */
    _bindDropdown: function() {
      var that = this;

      this.$button.on('click.Gumi', function(e) {
        e.stopPropagation();

        that.$dropdown.toggle();
      });

      $(document).on('click.Gumi', function(e) {
        if ($(e.target).closest(this.$dropdown).length === 0) {
          that.$dropdown.hide();
        }
      });
    },

    /**
     * When a user selects an option, we need to update our native
     * <select> in addition to our instance data
     */
    _bindSelectOption: function() {
      var that = this;

      this.$elem.on('click.Gumi', 'li', function(e) {
        e.stopPropagation();

        that.setSelectedOption($(this).index());
      })
    },

    /**
     * Sets the selected state to the native select box
     * based on the index. Also updates the instance and the label on the button
     * @param {number} opt_index Index of the select option to select (defaults 0)
     */
    setSelectedOption: function(opt_index) {
      opt_index = opt_index || 0;

      var $option = this.$select.find('option').eq(opt_index);

      $option
        .prop('selected', true)
        .trigger('change.Gumi');

      this.selectedIndex = opt_index;
      this.selectedLabel = $option.html();
      this.selectedValue = $option.val();

      this.$button.html('<span>' + this.selectedLabel + '</span>');

      // Trigger our custom callback
      this.options.onChange.call(that);
    },
  };

  /**
   * Simple jQuery API for Gumi
   */
  $.fn.gumi = function(options) {
    return this.each(function() {
      if (!$.data(this, 'gumi')) {
        $.data(this, 'gumi', new Gumi(this, options));
      }
    });
  };

 })(jQuery, window, document);