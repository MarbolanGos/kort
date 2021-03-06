/**
 * Store for select answers
 */
Ext.define('Kort.store.SelectAnswers', {
    extend: 'Ext.data.Store',

	config: {
		model: 'Kort.model.SelectAnswer',

		proxy: {
			type: 'rest',
            url: Kort.util.Config.getWebservices().answer.url,
            pageParam: false,
            startParam: false,
            limitParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage()
            },
            sorters: 'sorting',
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
		}
	}
});
