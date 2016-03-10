/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */

jQuery(function(){
        var confirm_delete = 'Are you sure you want to delete this object?';
        var date_format = '%m/%d/%Y';
        var datetime_format = '%Y-%m-%d %H:%M:%S';
        var regex_integer = /[^0-9\-]|\-(?=.)/g;
        var regex_number = /[^0-9\-\.,]|[\-](?=.)|[\.,](?=[0-9]*[\.,])/g;
        var doc = $(document);
        var undef = function(x){return typeof x === 'undefined';};
        var remove = function(elem,c){if(elem.hasClass(c)) elem.removeClass(c);};
        if(!String.prototype.reverse) {
            String.prototype.reverse = function () {
                return this.split('').reverse().join('');
            };
        }
        doc.on('click', '.close', function () {
                var t = $(this).parent();
                if (t.css('top') == '0px') t.slideUp('slow'); else t.fadeOut();
            });
        doc.on('keyup', 'input.integer', function () {                
                var nvalue = this.value.reverse().replace(regex_integer, '').reverse();
                if(this.value != nvalue) this.value = nvalue;
            });
        doc.on('keyup', 'input.number', function () {
                var nvalue = this.value.reverse().replace(regex_number, '').reverse();
                if(this.value != nvalue) this.value = nvalue;
            });
        doc.on('click', 'input[type="checkbox"].delete', function () {
                if(this.checked && !confirm(confirm_delete)) 
                    this.checked = false;
            });
        doc.on('keyup', 'input[data-range]', function () {
                var t=jQuery(this);
                var v=t.val();
                var range = t.attr('data-range').split(',');
                if(t.is('.integer')||t.is('.number')) {
                    console.log(v);
                    v = parseFloat(v);
                    range = [range[0]||parseFloat(range[0]),range[1]||parseFloat(range[1])];
                }
                if(undef(v)||((range[0]!='')&&v<range[0])||((range[1]!='')&&v>range[1])) 
                    t.addClass('error');
                else remove(t,'error');
            });
        doc.on('keyup', 'input[data-regex]', function () {
                var t=jQuery(this);
                var v=t.val();
                var re = new RegExp(t.attr('data-regex'));
                if(!v.match(re)) t.addClass('error'); else remove(t,'error');
            });
    });
