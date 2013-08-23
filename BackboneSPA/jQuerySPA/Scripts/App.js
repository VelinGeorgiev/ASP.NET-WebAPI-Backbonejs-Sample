//the namespace
var MyNs = MyNs || {}

//"use strict";

//the model
Employee = Backbone.Model.extend({

    initialize: function () {
        console.log('init performed');

        //bind event
        this.on("change:name", function (model) {
            var name = model.get("name");
            console.log("Name changed to: " + name);
        });
    },
    idAttribute: 'EmployeeId',
    urlRoot:'/api/Employee',
    url: function () {
        var base = this.urlRoot || (this.collection && this.collection.url) || "/";
        if (this.isNew())
            return base;

        return base + "/" + encodeURIComponent(this.id);
    }
});

Employees = Backbone.Collection.extend({
    model: Employee,
    url: '/api/Employee'
});

EmployeeView = Backbone.View.extend({

    tagName: 'div',

    attributes: {
        'class': 'emloyeeView'
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        'click a.delete': 'drop',
        'click a.update': 'update'
    },

    // Re-render the titles of the todo item.
    render: function () {

        //delete link
        var deleteLink = jQuery('<a>', {
            'href': 'javascript:;',
            'class': 'delete',
            'data-id': this.model.get('EmployeeId'), //add the model id in our case EmployeeId
            'text': 'Delete'
        });

        //uodate link
        var updateLink = jQuery('<a>', {
            'href': 'javascript:;',
            'class': 'update',
            'data-id': this.model.get('EmployeeId'), //add the model id in our case EmployeeId
            'text': 'Update'
        });

        //add more attributes to li
        this.$el.addClass('moreClass');
        this.$el.text(this.model.get('Name'));
        this.$el.attr('data-age', this.model.get('Age'));
        this.$el.append(deleteLink);
        this.$el.append(updateLink);

        return this;
    },

    // Remove the item, destroy the model.
    drop: function () {
        this.model.destroy();
    },

    update: function () {
        var age = this.model.get('Age');
        this.model.set({ 'Age': parseInt(age) + 1 });
        this.model.set({ 'Name': ('name' + Math.random()) });
        this.model.save();
    }

});

EmployeeCollectionView = Backbone.View.extend({
    
    el: '#allEmployees',

    initialize: function () {

        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.all);
        this.listenTo(this.collection, 'all', this.render);
        this.collection.fetch();
        
        //this.render();
    },

    render: function () {

        //remove if exist
        jQuery('a.newEmployee').remove();

        //create link
        var addLink = jQuery('<a>', {
            'href': 'javascript:;',
            'class': 'newEmployee',
            'text': 'Add'
        });

        this.$el.append(addLink);

        return this;
    },

    events: {
        'click a.newEmployee': 'newEmployee',
    },

    addOne: function (employee) {

        var employeeView = new EmployeeView({ model: employee })
        this.$el.append(employeeView.render().el);

    },

    all: function () {

        //define li and link elements for every entithy
        this.collection.each(this.addOne, this);
    },

    newEmployee: function (e) {
        e.preventDefault();

        var name = 'name' + Math.random();
        var age = Math.floor((Math.random() * 100) + 1);
        var gender = 'Female';
        var newEmployee = new Employee({ 'Name': name, 'Age': age, 'Gender': gender });
        
        var collection = this.collection;
        newEmployee.save().done(function () { collection.add(newEmployee) });
    }
});

var view = new EmployeeCollectionView({ collection: new Employees() });
