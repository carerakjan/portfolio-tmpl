function Card(options) {

}

Card.prototype.build = function() {
    return $('<div class="mdl-card mdl-shadow--2dp">')
        .append($('<div class="mdl-card__title mdl-card--expand">'))
        .append($('<div class="mdl-card__menu">' +
            '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
            '<i class="material-icons">loupe</i>' +
            '</button></div>'));
};

function Tiles(options) {

    this._container = options.container || $('<div class="mdl-grid mdl-grid--tails">');
    this._data = options.data || [];
    this._desktop = options.desktop || [];
    this._tablet = options.tablet || [];
    this._mobile = options.mobile || [];

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

    this._container.html('');

    if(this.isDesktop()) {
        this.build(this._container, this._desktop, 'desktop');
    }

    if(this.isTablet()) {
        this.build(this._container, this._tablet, 'tablet');
    }

    if(this.isMobile()) {
        this.build(this._container, this._mobile, 'mobile');
    }

    componentHandler && componentHandler.upgradeElement(this._container[0]);

    this._container.find('.mdl-cell').each(function(i, el) {
        $(el).css({height: window.getComputedStyle(el, null).getPropertyValue('height')});
    }.bind(this));

    this._container.find('.mdl-card').each(function(i, el) {
        $(el).css({'background-image': this._data[i] ? 'url('+this._data[i]+')' : ''})
    }.bind(this));

    return this._container;

};

Tiles.prototype.build = function _build(parent, schema, device) {
    if(!schema) return;

    schema.forEach(function(col) {

        if(typeof col === 'object') {
            var _col = Object.keys(col)[0];
            var el = $('<div class="mdl-cell mdl-cell--' + _col + '-col  ' +
                'mdl-cell--' + _col + '-col-' + device  + ' mdl-grid">');
            _build(el, col[_col], device);
            parent.append(el);
        } else {
            parent.append($('<div class="mdl-cell mdl-cell--' + col + '-col  ' +
                'mdl-cell--' + col + '-col-' + device + '">')
                .append($('<div class="mdl-cell--inner">').append(new Card().build())));
        }

    });
};