define(function() {
	(function(win) {
		var he = [
			' ^_______^',
			'│　    ＊ │',
			'│ ❤ ε ❤ │',
			' ┬—○——○—┬ ',
			' ○＿＿＿○'
		];
		var result = '\n';
		for (var i = 0, _len = he.length; i < _len; i++) {
			result = result + he[i] + '\n';
		}
		result += '\nGithub地址：https://github.com/wghe110';
		if (win.console) {
			console.log(result);
		}
	})(window)
})