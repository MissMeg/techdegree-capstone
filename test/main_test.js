const expect      = require('chai').expect;
const sinon       = require('sinon');
                    require('sinon-mongoose');
const mongoose    = require('mongoose');
const User        = require('../models/user');
const Group       = require('../models/group');
const Guest       = require('../models/guest');


describe('sanity check', () => {
  it('should run our tests using npm', () => {
    expect(true).to.be.ok;
  });
});


/////////MODEL VALIDATIONS///////////
describe('testing model validations', () => {
  describe('testing User model', (done) => {

    it('should return an error for missing name', (done) => {
      let user = {
        password: 'password'
      };
      User.create(user, (err, user) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should return an error for missing password', (done) => {
      let user = {
        name: 'Namey McName'
      };
      User.create(user, (err, user) => {
        expect(err).to.exist;
        done();
      });
    });
  });

  describe('testing Group model', () => {
    it('should return an error for missing groupName', (done) => {
      let group = {};
      Group.create(group, (err, group) => {
        expect(err).to.exist;
        done();
      });
    });
  });

  describe('testing Guest model', () => {
    it('should return an error for missing firstName', (done) => {
      let guest = {
        lastName: "LastNamey",
        child: false,
        confirmed: false
      };
      Guest.create(guest, (err, group) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should return an error for missing lastName', (done) => {
      let guest = {
        firstName: "firstNamey",
        child: false,
        confirmed: false
      };
      Guest.create(guest, (err, group) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should return an error for missing child bolean', (done) => {
      let guest = {
        firstName: "firstNamey",
        lastName: "LastNamey",
        confirmed: false
      };
      Guest.create(guest, (err, group) => {
        expect(err).to.exist;
        done();
      });
    });

    it('should return an error for missing confirmed bolean', (done) => {
      let guest = {
        firstName: "firstNamey",
        lastName: "LastNamey",
        child: false
      };
      Guest.create(guest, (err, group) => {
        expect(err).to.exist;
        done();
      });
    });
  });
});



/////////Getting DOCUMENTS///////////
describe('getting documents with each model', () => {

  describe('getting a user', () => {
    it('should get a user', (done) => {
      let user = {
        name: "Megan",
        password: "Testing"
      };
      let UserMock = sinon.mock(User);
      UserMock.expects('findOne').yields(null, user);
      User.findOne((err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(result).to.exist;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let  err = 'Something went wrong';
      let UserMock = sinon.mock(User);
      UserMock.expects('findOne').yields(err, null);
      User.findOne((err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(err).to.exist;
        expect(err).to.equal('Something went wrong');
        done();
      });
    });
  });

  describe('getting a guest', () => {
    it('should get a guest', (done) => {
      let guest = {
        firstName: "Megan",
        lastName: "Testing",
        group: 'abc123',
        child: false,
        confirmed: false,
        notes: '',
        submittedBy: 'abc123',
        submittedOn: 'Date'
      };
      let GuestMock = sinon.mock(Guest);
      GuestMock.expects('findOne').yields(null, guest);
      Guest.findOne((err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(result).to.exist;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let  err = 'Something went wrong';
      let GuestMock = sinon.mock(Guest);
      GuestMock.expects('findOne').yields(err, null);
      Guest.findOne((err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(err).to.exist;
        expect(err).to.equal('Something went wrong');
        done();
      });
    });
  });

  describe('getting a group', () => {
    it('should get a group', (done) => {
      let group = {
        groupName: "Teachers",
        members: []
      };
      let GroupMock = sinon.mock(Group);
      GroupMock.expects('findOne').yields(null, group);
      Group.findOne((err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(result).to.exist;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let  err = 'Something went wrong';
      let GroupMock = sinon.mock(Group);
      GroupMock.expects('findOne').yields(err, null);
      Group.findOne((err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(err).to.exist;
        expect(err).to.equal('Something went wrong');
        done();
      });
    });
  });
});


//////////CREATING DOCUMENTS///////////
describe('creating documents with each model', () => {
  describe('create a new user', () => {
    it('should create a new user', (done) => {
      let UserMock = sinon.mock(new User({name: "Megan", password: 'Testing'}));
      let user = UserMock.object;
      UserMock.expects('save').yields(null, user);
      user.save((err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(result).to.exist;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let UserMock = sinon.mock(new User({name: "Megan", password: 'Testing'}));
      let user = UserMock.object;
      let  err = 'Something went wrong';
      UserMock.expects('save').yields(err, null);
      user.save((err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(err).to.exist;
        expect(err).to.equal('Something went wrong');
        done();
      });
    });
  });

  describe('create a new user', () => {
    it('should create a new guest', (done) => {
      let GuestMock = sinon.mock(new Guest({firstName: "Megan", lastName: 'Testing', child: false, confirmed: false}));
      let guest = GuestMock.object;
      GuestMock.expects('save').yields(null, guest);
      guest.save((err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(result).to.exist;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let GuestMock = sinon.mock(new Guest({firstName: "Megan", lastName: 'Testing', child: false, confirmed: false}));
      let guest = GuestMock.object;
      let  err = 'Something went wrong';
      GuestMock.expects('save').yields(err, null);
      guest.save((err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(err).to.exist;
        expect(err).to.equal('Something went wrong');
        done();
      });
    });
  });

  describe('create a new group', () => {
    it('should create a new group', (done) => {
      let GroupMock = sinon.mock(new Group({groupName: 'Testing'}));
      let group = GroupMock.object;
      GroupMock.expects('save').yields(null, group);
      group.save((err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(result).to.exist;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let GroupMock = sinon.mock(new Group({groupName: 'Testing'}));
      let group = GroupMock.object;
      let  err = 'Something went wrong';
      GroupMock.expects('save').yields(err, null);
      group.save((err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(err).to.exist;
        expect(err).to.equal('Something went wrong');
        done();
      });
    });
  });
});

//////////UPDATING DOCUMENTS///////
describe('updating documents', () => {
  describe('updating users', () => {
    it('should update a user', (done) => {
      let UserMock = sinon.mock(new User({name: "Tessa"}));
      let user = UserMock.object;
      let expectedResult = {status: true};
      UserMock.expects('save').withArgs({_id: 12345}).yields(null, expectedResult);
      user.save({_id: 12345}, (err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let UserMock = sinon.mock(new User({name: "Tessa"}));
      let user = UserMock.object;
      let expectedResult = {status: false};
      UserMock.expects('save').withArgs({_id: 12345}).yields(expectedResult, null);
      user.save({_id: 12345}, (err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(err.status).to.be.false;
        done();
      });
    });
  });

  describe('updating guests', () => {
    it('should update a guest', (done) => {
      let GuestMock = sinon.mock(new Guest({firstName: "Tessa"}));
      let guest = GuestMock.object;
      let expectedResult = {status: true};
      GuestMock.expects('save').withArgs({_id: 12345}).yields(null, expectedResult);
      guest.save({_id: 12345}, (err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let GuestMock = sinon.mock(new Guest({firstName: "Tessa"}));
      let guest = GuestMock.object;
      let expectedResult = {status: false};
      GuestMock.expects('save').withArgs({_id: 12345}).yields(expectedResult, null);
      guest.save({_id: 12345}, (err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(err.status).to.be.false;
        done();
      });
    });
  });

  describe('updating groups', () => {
    it('should update a group', (done) => {
      let GroupMock = sinon.mock(new Group({groupName: "Tessa"}));
      let group = GroupMock.object;
      let expectedResult = {status: true};
      GroupMock.expects('save').withArgs({_id: 12345}).yields(null, expectedResult);
      group.save({_id: 12345}, (err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let GroupMock = sinon.mock(new Group({groupName: "Tessa"}));
      let group = GroupMock.object;
      let expectedResult = {status: false};
      GroupMock.expects('save').withArgs({_id: 12345}).yields(expectedResult, null);
      group.save({_id: 12345}, (err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(err.status).to.be.false;
        done();
      });
    });
  });
});


//////////DELETING DOCUMENTS///////
describe('deleting documents', () => {
  describe('deleting users', () => {
    it('should delete a user', (done) => {
      let UserMock = sinon.mock(User);
      let expectedResult = {status: true};
      UserMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
      User.remove({_id: 12345}, (err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let UserMock = sinon.mock(User);
      let expectedResult = {status: false};
      UserMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
      User.remove({_id: 12345}, (err, result) => {
        UserMock.verify();
        UserMock.restore();
        expect(err.status).to.be.false;
        done();
      });
    });
  });

  describe('deleting guests', () => {
    it('should delete a guest', (done) => {
      let GuestMock = sinon.mock(Guest);
      let expectedResult = {status: true};
      GuestMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
      Guest.remove({_id: 12345}, (err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let GuestMock = sinon.mock(Guest);
      let expectedResult = {status: false};
      GuestMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
      Guest.remove({_id: 12345}, (err, result) => {
        GuestMock.verify();
        GuestMock.restore();
        expect(err.status).to.be.false;
        done();
      });
    });
  });

  describe('deleting groups', () => {
    it('should delete a group', (done) => {
      let GroupMock = sinon.mock(Group);
      let expectedResult = {status: true};
      GroupMock.expects('remove').withArgs({_id: 12345}).yields(null, expectedResult);
      Group.remove({_id: 12345}, (err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(result.status).to.be.true;
        done();
      });
    });

    it('should return an error if failed', (done) => {
      let GroupMock = sinon.mock(Group);
      let expectedResult = {status: false};
      GroupMock.expects('remove').withArgs({_id: 12345}).yields(expectedResult, null);
      Group.remove({_id: 12345}, (err, result) => {
        GroupMock.verify();
        GroupMock.restore();
        expect(err.status).to.be.false;
        done();
      });
    });
  });
});
