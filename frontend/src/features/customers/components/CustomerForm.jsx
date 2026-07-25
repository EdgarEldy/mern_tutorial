import { useState } from 'react';
import { Link } from 'react-router-dom';

function CustomerForm({ initialValues, onSubmit, loading }) {
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? '');
  const [lastName, setLastName] = useState(initialValues?.last_name ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [telephone, setTelephone] = useState(initialValues?.telephone ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ first_name: firstName, last_name: lastName, email, telephone, address });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="telephone">Telephone</label>
          <input
            id="telephone"
            type="text"
            className="form-control"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      <Link to="/customers" className="btn btn-secondary">
        Cancel
      </Link>
    </form>
  );
}

export default CustomerForm;
