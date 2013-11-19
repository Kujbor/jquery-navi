/*
 * jquery.navi.js - jQuery plugin to implement AJAX-navigation through HTML-attributes
 * Author Oleg Taranov aka Kujbor
 * Copyright (C) 2013: CubeComp Development
 */
define("jquery.navi", ["jquery"], function($) {

    "use strict";

    $.navi = new function() {

        var self = this;

        this.starters = "[ajax-target][ajax-action]";
        this.domain = '';
        this.cached = true;

        this.actions = {};
        this.requests = {};
        this.cache = {};

        this.init = function(options) {

            if (options) {
                self.setup(options);
            }

            $(self.starters).on("click", function() {
                var elem = $(this);
                self.navigate({
                    target: elem.attr("ajax-target"),
                    action: elem.attr("ajax-action"),
                    cached: elem.attr("ajax-cached")
                });
            });
        };

        this.setup = function(options) {
            $.extend($.ajaxNavigation, options);
        };

        this.navigate = function(options) {

            var target = options.target;
            var action = options.action;

            if (self.actions[target] === action) {
                return false;
            }

            self.actions[target] = action;

            if (options.cached === "true") {
                options.cached = true;
            } else if (options.cached === "false") {
                options.cached = false;
            } else {
                options.cached = self.cached;
            }

            if (options.cached) {

                if (self.cache[target] && self.cache[target][action]) {
                    self.show(options);
                    return;
                }
            }

            self.load(options);
        };

        this.show = function(options, template) {

            var target = options.target;
            var action = options.action;

            if (!template) {
                template = self.cache[target][action];
            }

            $(target).html(template);
        };

        this.load = function(options) {

            var target = options.target;
            var action = options.action;

            if (self.requests[target]) {
                self.requests[target].abort();
            }

            var url;

            if (self.domain && action) {
                url = self.domain + '/' + action;
            } else {
                url = self.domain + action;
            }

            self.requests[target] = $.get(url, function(template) {

                if (options.cached) {

                    if (!self.cache[target]) {
                        self.cache[target] = {};
                    }

                    self.cache[target][action] = template;
                }

                self.show(options, template);
            });
        };
    };
});

$(document).ready($.navi.init);
