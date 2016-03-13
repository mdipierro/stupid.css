/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */

$.fn.autocomplete = function() {
    if(this.length>1)
        return this.each(function(){jQuery(this).autocomplete();});
    
    var options = eval('('+(this.data('source')||[])+')');
    var self = this;
    var swap=function(x){var w=$('<input/>').addClass(x.attr('class')).attr('style',x.attr('style')).attr('placeholder',x.attr('placeholder'));x.hide().after(w);return w;};
    var mode = this.data('mode')||'simple'; // 'chained' or 'keyed'
    var min_length = parseInt(this.data('min-length')||'2');
    var input = (mode=='keyed')?swap(self):self;
    options.sort(function(a,b){
            return (a[0]<b[0])?(-1):((a[0]>b[0])?(+1):0);});
    var map={},reverse={};
    var suggestion = input.clone().attr('placeholder','').hide();
    input.after(suggestion);
    var popup = jQuery('<ul class="autocomplete"/>').hide();    
    input.after(popup);
    if(mode=='map')
        for(var k=0;k<options.length;k++) {
            map[options[k][0]]=options[k][1];
            reverse[options[k][1]]=options[k][0];
        }
    input.focus(function(){
            popup.show();
            suggestion.show();
            suggestion.css({position:'absolute',
                        'z-index':1,
                        top:input.offset().top+'px',
                        left:input.offset().left+'px',
                        height:input.outerHeight()+'px',
                        color:'rgba(0,0,0,0.3)',
                        background:'transparent'});
    popup.css({'position':'absolute',
                'z-index':3000,
                'cursor':'pointer',
                'top':(input.offset().top+input.height()+10)+'px',
                'left':(input.offset().left)+'px',
                'background':'white',
                'box-shadow':'0 0 12px #ddd'});
        });
    popup.on('click','option',function(){
            /* todo */
        });
    input.blur(function(){
            popup.hide();
            suggestion.hide();
        });
    var p = 0;
    var get = function(){return input.val().split(/\s+/ig); }
    var cmp = function(a,b){return a.toLowerCase()==b.toLowerCase();};
    var select = function(item) {
        console.log(item);
        if(mode=='simple') {
            input.val(item[0]).change();            
        } else if(mode=='keyed') {
            input.val(item[0]);
            self.val(item[1]).change();
        } else if(mode=='chained') {
            var keywords = get();
            var k, v;
            for(k=0; k<keywords.length; k++) {
                v = keywords.slice(k).join(' ');
                if(cmp(v,item[0].substr(0,v.length))) break;
            }            
            input.val(input.val()+item[0].substr(v.length));
        }
    };
    var items = [];
    var tab = function(e) {
        if((e.keyCode==39 || e.keyCode==9) && items.length) {
            e.preventDefault();
            popup.hide();
            select(items[p]);
            p = 0;
            items = [];
        }
    };
    var keypress = function(e){                    
        var keywords = get();
        console.log('keywords:'+keywords+' :'+keywords.length);
        items = [];
        for(var k=0; k<keywords.length; k++) {
            console.log(k);
            var v = keywords.slice(k).join(' ');
            if(v.length>=min_length) {
                for(var i=0;i<options.length;i++) {
                    var s = options[i][0].substr(0,v.length);
                    if(cmp(s,v))
                        items.push(options[i]);
                }
            }
        }
        items.sort();
        if(e.keyCode==13) {
            p = 0;
            popup.hide();
            return;
        } else if(e.keyCode==40) {
            event.preventDefault();
            p = p+1;
        } else if(e.keyCode==38) {
            event.preventDefault();
            p = p-1;
            // up
        } else if(e.keyCode==39 || e.keyCode==9) {
            return;
        }
        if(items.length) {
            p = Math.max(0,Math.min(p,items.length-1));
            var v = input.val();
            suggestion.val(v+items[p][0].substr(v.length));
            suggestion.show();
            popup.show().html('');
            for(var i=0;i<items.length;i++) {
                var q = jQuery('<li>'+items[i][0]+'</li>');
                if(i==p) q.css('font-weight','bold');
                q.click((function(i){return function(){
                                select(items[i]);
                            };})(i));
                popup.append(q);
            }
        } else {
            suggestion.val('');
            popup.hide();
        }        
    };

    input.keyup(keypress).keydown(tab);
    $(window).on('resize',function(){
            suggestion.css({top:input.offset().top+'px',left:input.offset().left+'px'});
            popup.css({top:(input.offset().top+input.height()+10)+'px',left:input.offset().left+'px'});
        });
};

jQuery(function(){ jQuery('.autocomplete').autocomplete();});
