

Template.leaderboard.helpers({
    setup : function() {
        var _columns = [
            {
                name : 'Rank',
                varName : 'rowNum',
                class : 'row-number custom-td',
                transform : rowNumTransform
            },
            {
                name : 'Followers',
                varName : 'data_1',
                class : 'data-1 custom-td'
            },
            {
                name : 'Gender',
                varName : 'data_2',
                class : 'data-2 custom-td'
            }
        ];
        var _css = {
            table_class : 'custom-table',
            row_class : 'custom-row'
        };
        return _.extend(this, { columns : _columns , css : _css });
    },
    count : function() {
        var count = Meteor.users.find().count();
        console.log(count);
        if (count == undefined) return 0;
        return count.count;
    }
});

var rowNumTransform = function(_data) {
    var data = _data;
    var html = new Handlebars.SafeString(data);
    return html;
}
