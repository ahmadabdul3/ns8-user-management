import React, { Component, PureComponent } from 'react';
import http from 'src/frontend/services/http';
import FormInput from 'src/frontend/components/form_input';

export default class HomePage extends PureComponent {
  render() {
    return (
      <div className='home-page'>
        <UserSection />
        <EventSection />
      </div>
    );
  }
}

class UserSection extends PureComponent {
  state = {
    createFormVisible: false,
    users: [],
  };

  componentDidMount() {
    this.refreshData();
  }

  showCreateForm = () => this.setState({ createFormVisible: true });

  hideCreateForm = ({ refreshData }) => {
    this.setState({ createFormVisible: false }, () => {
      if (refreshData) this.refreshData();
    });
  }

  refreshData = async () => {
    try {
      const response = await http.get('/users');
      this.setState({ users: response.data });
    } catch (e) {}
  }

  render() {
    const { createFormVisible, users } = this.state;

    return (
      <div className='page-section'>
        <section className='page-section-header'>
          <h2 className='page-section-title'>
            Users
          </h2>
          <div className='page-section-action' onClick={this.showCreateForm}>
            + Add User
          </div>
        </section>
        {
          createFormVisible && (
            <UserCreateForm hideCreateForm={this.hideCreateForm} />
          )
        }
        <section className='list'>
          {
            users.length > 0 ? users.map(user => (
              <div className='user-record' key={user.id}>
                <div>
                  id: { user.id }
                </div>
                <div>
                  email: { user.email }
                </div>
                <div>
                  phone: { user.phone || 'N/A' }
                </div>
              </div>
            )) : (
              <div className='no-data'>
                No Users Found...
              </div>
            )
          }
        </section>
      </div>
    );
  }
}

class UserCreateForm extends PureComponent {
  state = {
    userError: '',
    email: '',
    password: '',
    phone: '',
  }

  createUser = async (e) => {
    try {
      e.preventDefault();
      const user = {
        email: this.state.email,
        password: this.state.password,
        phone: this.state.phone,
      };
      const response = await http.post('/users', { user });
      this.props.hideCreateForm({ refreshData: true });
    } catch (e) {
      this.setState({ userError: e.friendlyMessage });
    }
  }

  onChange = ({ name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    const { userError, email, password, phone } = this.state;

    return (
      <form onSubmit={this.createUser} className='form-box'>
        <h3 className='form-title'>
          New User
        </h3>
        <FormInput
          labelText='Email'
          name='email'
          value={email}
          onChange={this.onChange}
          />
        <FormInput
          labelText='Password'
          name='password'
          value={password}
          onChange={this.onChange}
          />
        <FormInput
          labelText='Phone'
          name='phone'
          value={phone}
          onChange={this.onChange}
          />
          {
            userError && (
              <div className='form-message'>
                {userError}
              </div>
            )
          }
          <div className='form-buttons'>
            <div className='cancel' onClick={this.props.hideCreateForm}>
              cancel
            </div>
            <button className='green-button'>
              Create
            </button>
          </div>
      </form>
    );
  }
}

class EventSection extends PureComponent {
  state = {
    createFormVisible: false,
    events: [],
    userIdFilter: '',
  }

  componentDidMount() {
    this.refreshData();
  }

  showCreateForm = () => this.setState({ createFormVisible: true });

  hideCreateForm = ({ refreshData }) => {
    this.setState({ createFormVisible: false }, () => {
      if (refreshData) this.refreshData();
    });
  }

  refreshData = async (options) => {
    const filter = options && options.filter || '';
    try {
      const response = await http.get('/events' + filter);
      this.setState({ events: response.data });
    } catch (e) {
      this.setState({ events: [] });
    }
  }

  determineRadioFilter = (e) => {
    const { value } = e.target;
    if (value === 'user-id-filter') {
      this.setState({ userIdRadioSelected: true });
    } else if (value === 'all-filter') {
      this.setState({ userIdRadioSelected: false, userIdFilter: '' }, () => {
        this.refreshData();
      });
    } else if (value === 'latest-filter') {
      this.setState({ userIdRadioSelected: false, userIdFilter: '' }, () => {
        this.refreshData({ filter: '?latest=true' });
      });
    }
  }

  filterUserId = () => {
    this.refreshData({ filter: '?userId=' + this.state.userIdFilter });
  }

  changeUserId = (e) => this.setState({ userIdFilter: e.target.value });

  render() {
    const {
      events,
      createFormVisible,
      userIdRadioSelected,
      userIdFilter,
    } = this.state;

    return (
      <div className='page-section'>
        <section className='page-section-header'>
          <h2 className='page-section-title'>
            Events
          </h2>
          <div className='page-section-action' onClick={this.showCreateForm}>
            + Add Event
          </div>
        </section>
        <section className='filters'>
          <input
            id='latest'
            type='radio'
            name='filter'
            value='all-filter'
            onChange={this.determineRadioFilter} />
          <label htmlFor='latest' style={{ 'marginLeft': '5px' }}>
            All
          </label>

          <input
            style={{ marginLeft: '20px' }}
            id='latest'
            type='radio'
            name='filter'
            value='latest-filter'
            onChange={this.determineRadioFilter} />
          <label htmlFor='latest' style={{ 'marginLeft': '5px' }}>
            Latest
          </label>

          <input
            id='user'
            type='radio'
            name='filter'
            style={{ 'marginLeft': '20px' }}
            value='user-id-filter'
            onChange={this.determineRadioFilter} />
          <label htmlFor='latest' style={{ 'marginLeft': '5px' }}>
            User ID
          </label>
          {
            userIdRadioSelected && (
              <React.Fragment>
                <input
                  type='text'
                  className='filter-user-id'
                  onChange={this.changeUserId}
                  value={userIdFilter} />
                <button className='filter-confirm-button' onClick={this.filterUserId}>
                  apply
                </button>
              </React.Fragment>
            )
          }
        </section>
        {
          createFormVisible && (
            <EventCreateForm hideCreateForm={this.hideCreateForm} />
          )
        }
        <section className='list'>
          {
            events.length > 0 ? events.map(ev => (
              <div className='user-record' key={ev.id}>
                <div>
                  id: { ev.id }
                </div>
                <div>
                  type: { ev.type }
                </div>
                <div>
                  userId: { ev.userId }
                </div>
                <div>
                  created: { ev.createdAt }
                </div>
              </div>
            )) : (
              <div className='no-data'>
                No Events Found...
              </div>
            )
          }
        </section>
      </div>
    )
  }
}

class EventCreateForm extends PureComponent {
  state = {
    eventError: '',
    type: '',
    userId: '',
  };

  createEvent = async (e) => {
    try {
      e.preventDefault();
      const event = {
        type: this.state.type,
        userId: this.state.userId,
      };
      const response = await http.post('/events', { event });
      this.props.hideCreateForm({ refreshData: true });
    } catch (e) {
      this.setState({ eventError: e.friendlyMessage });
    }
  }

  onChangeEvent = ({ name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    const { eventError, type, userId } = this.state;

    return (
      <form onSubmit={this.createEvent} className='form-box'>
        <h3 className='form-title'>
          New Event
        </h3>
        <FormInput
          labelText='Type'
          name='type'
          value={type}
          onChange={this.onChangeEvent}
          />
        <FormInput
          labelText='userId'
          name='userId'
          value={userId}
          onChange={this.onChangeEvent}
          />
        {
          eventError && (
            <div className='form-message'>
              {eventError}
            </div>
          )
        }
        <div className='form-buttons'>
          <div className='cancel' onClick={this.props.hideCreateForm}>
            cancel
          </div>
          <button className='green-button'>
            Create
          </button>
        </div>
      </form>
    );
  }
}
