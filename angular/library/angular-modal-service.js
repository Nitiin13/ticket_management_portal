//  angularModalService.js
//
//  Service for showing modal dialogs.

/***** JSLint Config *****/
/*global angular  */
(function() {

    'use strict';

    var module = angular.module('angularModalService', []);

    module.factory('ModalService', ['$animate', '$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateRequest', '$timeout',
        function($animate, $document, $compile, $controller, $http, $rootScope, $q, $templateRequest, $timeout) {

            //  Get the body of the document, we'll add the modal to this.
            var body = $document.find('body');

            function ModalService() {

                var self = this;
                self.recentlyOpen = false;
                //  Returns a promise which gets the template, either
                //  from the template parameter or via a request to the
                //  template url parameter.
                var getTemplate = function(template, templateUrl) {
                    var deferred = $q.defer();
                    if (template) {
                        deferred.resolve(template);
                    } else if (templateUrl) {
                        $templateRequest(templateUrl, true)
                            .then(function(template) {
                                deferred.resolve(template);
                            }, function(error) {
                                deferred.reject(error);
                            });
                    } else {
                        deferred.reject("No template or templateUrl has been specified.");
                    }
                    return deferred.promise;
                };

                //  Adds an element to the DOM as the last child of its container
                //  like append, but uses $animate to handle animations. Returns a
                //  promise that is resolved once all animation is complete.
                var appendChild = function(parent, child) {
                    var children = parent.children();
                    if (children.length > 0) {
                        return $animate.enter(child, parent, children[children.length - 1]);
                    }
                    return $animate.enter(child, parent);
                };

                self.showModal = function(options) {
                    //  Create a deferred we'll resolve when the modal is ready.
                    var deferred = $q.defer();

                    //  Validate the input parameters.
                    var controllerName = options.controller;
                    if (!controllerName) {
                        deferred.reject("No controller has been specified.");
                        return deferred.promise;
                    }

                    // prevent to open same modal multiple time on multiple clicks
                    if(self.recentlyOpen == true){
                        deferred.reject("Modal recently opened.");
                        return deferred.promise;
                    }
                    
                    self.recentlyOpen = true;

                    // false recentlyOpen variable, so another modal can open
                    $timeout(function() {
                        self.recentlyOpen = false;
                    },1500)

                    //  Get the actual html of the template.
                    getTemplate(options.template, options.templateUrl)
                        .then(function(template) {

                            //  Create a new scope for the modal.
                            var modalScope = (options.scope || $rootScope).$new();

                            //  Create the inputs object to the controller - this will include
                            //  the scope, as well as all inputs provided.
                            //  We will also create a deferred that is resolved with a provided
                            //  close function. The controller can then call 'close(result)'.
                            //  The controller can also provide a delay for closing - this is
                            //  helpful if there are closing animations which must finish first.
                            var closeDeferred = $q.defer();
                            var closedDeferred = $q.defer();
                            var inputs = {
                                $scope: modalScope,
                                close: function(ev, result, delay) {
                                    
                                     if(angular.isDefined(modalElement[0]))
                                        modalElement[0].style.overflow = "hidden";   

                                    document.body.style.overflow = "auto";

                                    // if (angular.isDefined(ev)) {
                                    closeThisDiv(ev, options.target, modalElement[0]);
                                    // }
                                    // if(ev.target.classList.contains('modal__bg') || ev.target.classList.contains('modal__close')){
                                    if (delay === undefined || delay === null) delay = 300;
                                    $timeout(function() {
                                        //  Resolve the 'close' promise.
                                        closeDeferred.resolve(result);
                                        //  Let angular remove the element and wait for animations to finish.
                                        $animate.leave(modalElement)
                                            .then(function() {
                                                //  Resolve the 'closed' promise.
                                                closedDeferred.resolve(result);

                                                //  We can now clean up the scope
                                                modalScope.$destroy();

                                                //  Unless we null out all of these objects we seem to suffer
                                                //  from memory leaks, if anyone can explain why then I'd
                                                //  be very interested to know.
                                                inputs.close = null;
                                                deferred = null;
                                                closeDeferred = null;
                                                modal = null;
                                                inputs = null;
                                                modalElement = null;
                                                modalScope = null;
                                            });
                                    }, delay);
                                }
                                // }
                            };

                            //  If we have provided any inputs, pass them to the controller.
                            if (options.inputs) angular.extend(inputs, options.inputs);

                            //  Compile then link the template element, building the actual element.
                            //  Set the $element on the inputs so that it can be injected if required.
                            var linkFn = $compile(template);
                            var modalElement = linkFn(modalScope);
                            inputs.$element = modalElement;

                            //  Create the controller, explicitly specifying the scope to use.
                            var controllerObjBefore = modalScope[options.controllerAs];
                            var modalController = $controller(options.controller, inputs, false, options.controllerAs);

                            if (options.controllerAs && controllerObjBefore) {
                                angular.extend(modalController, controllerObjBefore);
                            }

                            //  Finally, append the modal to the dom.
                            if (options.appendElement) {
                                // append to custom append element
                                appendChild(options.appendElement, modalElement);
                            } else {
                                // append to body when no custom append element is specified
                                appendChild(body, modalElement);
                                // console.log(options.target);
                                // console.log(modalElement[0]);
                                var targetExpand = "no";
                                if (options.targetExpand == 'yes') {
                                    targetExpand = "yes";
                                };
                                // console.log(modalElement);
                                makeDiv(options.target, modalElement[0], targetExpand,options);
                            }

                            //  We now have a modal object...

                            var modal = {
                                controller: modalController,
                                scope: modalScope,
                                element: modalElement,
                                close: closeDeferred.promise,
                                closed: closedDeferred.promise
                            };
                            //made by palash to close the div on pressing esc key
                            function closeonesc(e) {
                                if (e.keyCode == 27) {
                                    inputs.close(window.event);
                                    document.removeEventListener("keyup", closeonesc);
                                }
                            }
                            if(!options.disableEscExit)
                                document.addEventListener('keyup', closeonesc);
                            //  ...which is passed to the caller via the promise.
                            deferred.resolve(modal);

                        })
                        .then(null, function(error) { // 'catch' doesn't work in IE8.
                            deferred.reject(error);
                        });

                    return deferred.promise;
                };

            }

            return new ModalService();
        }
    ]);
    var makeDiv = function(self, modal, targetExpand, options) {
        var fakediv = document.getElementById('modal__temp');

        /**
         * if there isn't a 'fakediv', create one and append it to the button that was
         * clicked. after that execute the function 'moveTrig' which handles the animations.
         */

        if (fakediv === null) {
            var div = document.createElement('div');
            if (targetExpand == 'yes') {
                if (self.tagName.toLowerCase() == 'img' || self.getElementsByTagName('img').length > 0) {
                    div.appendChild(self.cloneNode(true));
                    div.getElementsByTagName('img')[0].style.width = '100%'
                }
            } else {
                // div.style.background='black';
            }

            div.id = 'modal__temp';
            document.body.appendChild(div);
            moveTrig(self, modal, div, options);
        } else {
            var myInt = setInterval(function() {
                var fakediv = document.getElementById('modal__temp');
                if (fakediv === null) {
                    makeDiv(self, modal, targetExpand, options);
                    clearInterval(myInt);
                };
            }, 100);
        }
    };

    var w = window;
    var contentDelay = 400;
    var isOpen = false;
    var moveTrig = function(trig, modal, div, options) {
        var trigProps = trig.getBoundingClientRect();
        var m = modal;
        var bh_m = m.querySelector('.modal__below_header');
        var mProps = bh_m.getBoundingClientRect();
        var transX, transY, scaleX, scaleY;
        var xc = w.innerWidth / 2;
        var yc = w.innerHeight / 2;

        // this class increases z-index value so the button goes overtop the other buttons
        trig.classList.add('modal__trigger--active');

        // these values are used for scale the temporary div to the same size as the modal
        scaleX = mProps.width / trigProps.width;
        scaleY = mProps.height / trigProps.height;
        scaleX = scaleX.toFixed(3); // round to 3 decimal places
        scaleY = scaleY.toFixed(3);


        // these values are used to move the button to the center of the window
        transX = Math.round(xc - trigProps.left - trigProps.width / 2);
        // transY = Math.round(yc - trigProps.top - trigProps.height / 2);

        // if the modal is aligned to the top then move the button to the center-y of the modal instead of the window
        // if (m.classList.contains('modal--align-top')) {
        transY = Math.round(mProps.height / 2 + mProps.top - trigProps.top - trigProps.height / 2 + 40);
        // }

        // translate button to center of screen
        // trig.style.transform = 'translate(' + transX + 'px, ' + transY + 'px)';
        div.style.left = trigProps.left + "px";
        div.style.top = trigProps.top + "px";
        div.style.height = trigProps.height + "px";
        div.style.width = trigProps.width + "px";
        document.body.style.overflow = "hidden";

        //pal
        var div_bg = document.createElement('div');
        div_bg.id = 'modal__temp__bg';
        document.body.appendChild(div_bg);
        div.style.transform = 'translate(' + transX + 'px, ' + transY + 'px)' + 'scale(' + scaleX + ',' + scaleY + ')';
        // trig.style.webkitTransform = 'translate(' + transX + 'px, ' + transY + 'px)';
        div.style.webkitTransform = 'translate(' + transX + 'px, ' + transY + 'px)' + 'scale(' + scaleX + ',' + scaleY + ')';
        // expand temporary div to the same size as the modal
        // div.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
        // div.style.webkitTransform = 'scale(' + scaleX + ',' + scaleY + ')';


        setTimeout(function() {
            var mPrsxops = bh_m.getBoundingClientRect();
            var scaleX_new = mPrsxops.width / trigProps.width;
            var scaleY_new = mPrsxops.height / trigProps.height;
            div.style.transform = 'translate(' + transX + 'px, ' + transY + 'px)' + 'scale(' + scaleX_new + ',' + scaleY_new + ')';
            div.style.webkitTransform = 'translate(' + transX + 'px, ' + transY + 'px)' + 'scale(' + scaleX_new + ',' + scaleY_new + ')';
            window.setTimeout(function() {
                div_bg.style.opacity = ".96";
                if(options.changeOpacity){
                    div_bg.style.opacity = ".76";
                    div_bg.style.background = "#D8E6FF";
                }
            }, 10)
        }, 100);


        window.setTimeout(function() {
            window.requestAnimationFrame(function() {
                open(m, div, div_bg);
            });
        }, contentDelay);

    };

    var open = function(m, div, div_bg) {
        // if (!isOpen) {
            // select the content inside the modal
            var content = m.querySelector('.modal__content');
            // reveal the modal
            m.classList.add('modal--active');
            // reveal the modal content
            content.classList.add('modal__content--active');

            /**
             * when the modal content is finished transitioning, fadeout the temporary
             * expanding div so when the window resizes it isn't visible ( it doesn't
             * move with the window).
             */
            // content.addEventListener('transitionend', hideDiv, false);

            isOpen = true;
        // }
        div.style.opacity = '0';
        // div_bg.style.opacity = '0';
        // function hideDiv() {
        //   // fadeout div so that it can't be seen when the window is resized
        //   console.log("hiding");
        //   div.style.opacity = '0';
        //   // content.removeEventListener('transitionend', hideDiv, false);
        // }
    };


    var closeThisDiv = function(event, t, m) {
        m.style.opacity = 0;
        if (angular.isDefined(event)) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        var div = document.getElementById('modal__temp');
        /**
         * make sure the modal__bg or modal__close was clicked, we don't want to be able to click
         * inside the modal and have it close.
         */

        // console.log("okss")
        // if (isOpen) {
            // console.log(target.classList);
            // console.log(isOpen);
            // if (isOpen && target.classList.contains('modal__bg') || target.classList.contains('modal__close')) {
            // console.log("lol")
            // make the hidden div visible again and remove the transforms so it scales back to its original size
            // console.log("ok")
            div.style.opacity = '1';
            // div.removeAttribute('style');

            /**
             * iterate through the modals and modal contents and triggers to remove their active classes.
             * remove the inline css from the trigger to move it back into its original position.
             */
            // console.log(options.target);
            // console.log(modalElement[0]);
            var content = m.querySelector('.modal__content');
            // for (var i = 0; i < len; i++) {
            m.classList.remove('modal--active');
            content.classList.remove('modal__content--active');
            div.style.transform = 'none';
            div.style.webkitTransform = 'none';
            t.classList.remove('modal__trigger--active');
            document.body.style.overflow = "auto";
            // }

            // when the temporary div is opacity:1 again, we want to remove it from the dom
            // div.addEventListener('transitionend', removeDiv, false);
            var div_bg = document.getElementById('modal__temp__bg');
            div_bg.style.opacity = 0;
            isOpen = false;
        // }

        // function removeDiv() {
        //     setTimeout(function() {
                window.requestAnimationFrame(function() {
                    // remove the temp div from the dom with a slight delay so the animation looks good
                    angular.element(div).remove();
                    angular.element(div_bg).remove();
                    // div_bg.remove();
                });
        //     }, contentDelay - 50);
        // }

    };
}());
