;(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			clientWidth = (clientWidth >= 750 ? 750 : clientWidth);
			docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
		};
	recalc();

	var tid;
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, function() {
		clearTimeout(tid);
		tid = setTimeout(recalc, 300);
	}, false);
})(document, window);