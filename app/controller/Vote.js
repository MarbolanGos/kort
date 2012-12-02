Ext.define('Kort.controller.Vote', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'validation.NavigationView',
            'validation.vote.ButtonContainer',
            'validation.vote.Container',
            'validation.vote.TabPanel',
            'LeafletMap'
        ],
        refs: {
            validationNavigationView: '#validationNavigationView',
            detailTabPanel: '.votetabpanel',
            voteMap: '.votetabpanel .kortleafletmap[cls=voteMap]',
            voteAcceptButton: '.votetabpanel .votecontainer .button[cls=voteConfirmButton]',
            voteDeclineButton: '.votetabpanel .votecontainer .button[cls=voteDeclineButton]',
            voteCancelButton: '.votetabpanel .votecontainer .button[cls=voteCancelButton]'
        },
        control: {
            voteMap: {
                maprender: 'onMaprender'
            },
            voteAcceptButton: {
                tap: 'onVoteAcceptButtonTap'
            },
            voteDeclineButton: {
                tap: 'onVoteDeclineButtonTap'
            },
            voteCancelButton: {
                tap: 'onVoteCancelButtonTap'
            }
        }
    },
    
    onVoteAcceptButtonTap: function() {
        this.sendVote('true');
    },
    
    onVoteDeclineButtonTap: function() {
        this.sendVote('false');
    },
    
    onVoteCancelButtonTap: function() {
        // remove detail panel
        this.getValidationNavigationView().pop();
    },
    
    sendVote: function(valid) {
        var me = this,
            detailTabPanel = this.getDetailTabPanel(),
            userId = Kort.user.get('id'),
            vote;
            
        me.showSendMask();
        vote = Ext.create('Kort.model.Vote', { fix_id: detailTabPanel.getRecord().get('id'), user_id: userId, valid: valid });
        vote.save({
            success: function(records, operation) {
                me.hideSendMask();
                me.voteSuccessfulSubmittedHandler(operation.getResponse().responseText);
            },
            failure: function() {
                me.hideSendMask();
                var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('vote.alert.submit.failure.title'), Ext.i18n.Bundle.message('vote.alert.submit.failure.message'), Ext.emptyFn);
            }
        });
    },
    
    voteSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig);
        
        this.getApplication().fireEvent('votesend');
        
        this.showRewardMessageBox(reward);
        // remove detail panel
        this.getValidationNavigationView().pop();
    },
    
    showSendMask: function() {
        this.getValidationNavigationView().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('vote.sendmask.message'),
            zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
        });
    },
    
    hideSendMask: function() {
        this.getValidationNavigationView().setMasked(false);
    },
    
	showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});