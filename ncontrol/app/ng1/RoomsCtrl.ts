export let RoomsCtrl = ['DataService',
    function(DataService) {
        this.list = DataService.getTable('rooms').listed;

        this.imageUrl = function(room) {
            return "/images/" + room.fields.name + ".png";
        }

    }
];
