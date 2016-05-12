!function($) {

    function Card(options) {
        this.createCardContainer();
        this.createTitle(options.lighteningEffect || null);
        this.createMenu(options.menuButton || {});

        if(options.shadowDepths) {
            this.assignShadow(options.shadowDepths);
        }

        this.build();
    }

    Card.prototype.createCardContainer = function() {
        this.$element = $('<div>').addClass('mdl-card');
    };

    Card.prototype.assignShadow = function(depths) {
        this.$element.addClass('mdl-shadow--' + depths);
    };

    Card.prototype.createTitle = function(lighteningEffect) {
        this.$title = $('<div>').addClass('mdl-card__title');
        lighteningEffect && this.$title.addClass(' mdl-card--expand');
    };

    Card.prototype.createMenu = function(options) {
        this.$menu = $('<div>').addClass('mdl-card__menu');
        this.$menuButton = $('<button>').addClass('mdl-button mdl-button--icon mdl-js-button');
        this.$menuButton.html('<i class="material-icons">loupe</i>');        
        
        options.rippleEffect && this.$menuButton.addClass('mdl-js-ripple-effect');
        options.icon && this.$menuButton.find('i').html(options.icon);        
        
        this.$menu.append(this.$menuButton);
    };

    Card.prototype.build = function() {
        this.$element.append(this.$title);
        this.$menu && this.$element.append(this.$menu);
    };

    function Tiles(options) {

        this.$container = $(options.container);
        this._data = options.data || [];
        this._desktop = options.desktop || [];
        this._tablet = options.tablet || [];
        this._mobile = options.mobile || [];
        this._tile = options.tile || {};

    }

    Tiles.prototype.isDesktop = function() {
        return window.matchMedia('(min-width: 840px)').matches;
    };
    Tiles.prototype.isTablet = function() {
        return window.matchMedia('(max-width: 839px) and (min-width: 480px)').matches;
    };
    Tiles.prototype.isMobile = function() {
        return window.matchMedia('(max-width: 479px)').matches;
    };

    Tiles.prototype.render = function() {

        this.$container.empty();

        if(this.isDesktop()) {
            this.build(this.$container, this._desktop, 'desktop');
        }

        if(this.isTablet()) {
            this.build(this.$container, this._tablet, 'tablet');
        }

        if(this.isMobile()) {
            this.build(this.$container, this._mobile, 'mobile');
        }

        componentHandler && componentHandler.upgradeElement(this.$container[0]);

        this.$container.find('.mdl-cell').each(function(i, el) {
            $(el).css({height: window.getComputedStyle(el, null).getPropertyValue('height')});
        }.bind(this));

        this.$container.find('.mdl-card').each(function(i, el) {
            $(el).css({'background-image': this._data[i] ? 'url('+this._data[i]+')' : ''})
        }.bind(this));

        return this.$container;

    };

    Tiles.prototype.build = function _build(parent, schema, device) {
        if(!schema) return;

        schema.forEach(function(col) {

            if(typeof col === 'object') {
                var _col = Object.keys(col)[0];
                var el = $('<div class="mdl-cell mdl-cell--' + _col + '-col  ' +
                    'mdl-cell--' + _col + '-col-' + device  + ' mdl-grid">');
                _build.apply(this, [el, col[_col], device]);
                parent.append(el);
            } else {
                parent.append($('<div class="mdl-cell mdl-cell--' + col + '-col  ' +
                    'mdl-cell--' + col + '-col-' + device + '">')
                    .append($('<div class="mdl-cell--inner">').append(new Card(this._tile).$element)));
            }

        }.bind(this));
    };

    $.fn.tiles = function(options) {

        var tiles = new Tiles({
            container: this,
            desktop: options.scheme.desktop,
            tablet: options.scheme.tablet,
            mobile: options.scheme.mobile,
            data: options.data,
            tile: options.tile
        });

        $(this).data('tiles', tiles);

        if(options.resizeListener) {
            $(window).on('resize', tiles.render.bind(tiles));
        }

        tiles.render();

        return this;
    };

}(jQuery);

