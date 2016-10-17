export let RoomsCtrl = ['DataService',
    function(DataService) {
        this.list = DataService.getTable('rooms').indexed;

        this.imageUrl = function(room) {
            return "/images/" + room.fields.name + ".png";
        }

    }
];
