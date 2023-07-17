'use client';
import { useState } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

export default function Demo() {
  const [switched, setSwitched] = useState(false);
  return (
    <div className={s.container}>
      <div className={cn(s.demo, { [s._switched]: switched })}>
        <div className={s.demoInner}>
          <div className={s.demoForms}>
            <div className={s.demoForm}>
              <div className={s.demoFormContent}>
                <FakeForm
                  heading="Welcome back"
                  fields={['email', 'password']}
                  submitLabel="Sign in"
                />
              </div>
            </div>
            <div className={s.demoForm}>
              <div className={s.demoFormContent}>
                <FakeForm
                  heading="Time to feel like home"
                  fields={['name', 'email', 'password']}
                  submitLabel="Sign up"
                />
              </div>
            </div>
          </div>
          <div className={s.demoSwitcher}>
            <div className={s.demoSwitcherInner}>
              <div className={s.demoSwitcherContent}>
                <div className={s.demoSwitcherText}>
                  <div>
                    <h3>New here?</h3>
                    <p>
                      Sign up and discover great amount of new opportunities!
                    </p>
                  </div>
                  <div>
                    <h3>One of us?</h3>
                    <p>
                      If you already has an account, just sign in. We&apos;ve
                      missed you!
                    </p>
                  </div>
                </div>
                <button
                  className={s.demoSwitcherBtn}
                  onClick={() => setSwitched(!switched)}
                >
                  <span className={s.demoSwitcherBtnInner}>
                    <span>Sign Up</span>
                    <span>Sign In</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FakeFormProps {
  heading: string;
  fields: string[];
  submitLabel: string;
}

function FakeForm({ heading, fields, submitLabel }: FakeFormProps) {
  return (
    <form className={s.form} onSubmit={(e) => e.preventDefault()}>
      <div className={s.formHeading}>{heading}</div>
      {fields.map((field) => (
        <label className={s.formField} key={field}>
          <span className={s.formFieldLabel}>{field}</span>
          <input className={s.formFieldInput} type={field} />
        </label>
      ))}
      <button type="submit" className={s.formSubmit}>
        {submitLabel}
      </button>
    </form>
  );
}
