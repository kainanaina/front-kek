'use client';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import cn from 'classnames';
import { preventNonNumbers } from 'src/utils';
import s from './styles.module.scss';

type PropsType = Record<string, number>;

type ParamsConfigType = Record<
  string,
  {
    label: string;
    min?: number | string;
    max?: number | string;
    allowDecimals?: boolean;
    decimalStep?: number;
  }
>;

function DemoContainer({
  component: Component,
  beforeDemo,
  afterDemo,
  initialProps = {},
  paramsConfig = {},
  style,
}: {
  component: React.ComponentType<PropsType>;
  beforeDemo?: React.ReactNode;
  afterDemo?: React.ReactNode;
  initialProps?: PropsType;
  paramsConfig?: ParamsConfigType;
  style?: React.CSSProperties;
}) {
  const [props, setProps] = useState(initialProps);
  const [resetKey, setResetKey] = useState(0);
  const [paramsResetKey, setParamsResetKey] = useState(0);

  const handleChangeProps = (newProps: PropsType) => {
    setProps(newProps);
    setResetKey(Date.now());
  };

  return (
    <div className={s.demoContainer}>
      <div className={s.demoContent} style={style}>
        <ErrorBoundary
          key={resetKey}
          fallback={
            <div className={s.demoError}>
              <p>
                Oops, seems that demo couldn&apos;t handle provided params and
                crashed!
              </p>
              <button
                onClick={() => {
                  handleChangeProps(initialProps);
                  setParamsResetKey(Date.now());
                }}
              >
                <span className="animated-border alt-2" />
                Reset Demo Params
              </button>
            </div>
          }
        >
          {beforeDemo}
          <Component {...props} />
          {afterDemo}
        </ErrorBoundary>
      </div>

      {!!Object.keys(paramsConfig)?.length && (
        <DemoParams
          key={`params-${paramsResetKey}`}
          initialProps={initialProps}
          paramsConfig={paramsConfig}
          onSubmit={handleChangeProps}
        />
      )}
    </div>
  );
}

function DemoParams({
  initialProps,
  paramsConfig,
  onSubmit,
}: {
  initialProps: PropsType;
  paramsConfig?: ParamsConfigType;
  onSubmit: (props: PropsType) => void;
}) {
  const [formState, setFormState] = useState(initialProps);
  const [paramsVisible, setParamsVisible] = useState(false);

  const getBoundryValue = (key?: number | string) => {
    if (typeof key === 'number') {
      return key;
    }
    if (typeof key === 'string') {
      return formState[key];
    }
    return undefined;
  };

  const handleSubmit = () => {
    const newState = Object.keys(formState).reduce((acc, key) => {
      let val = formState[key];
      const { min, max } = paramsConfig?.[key] ?? {};

      const maxVal = getBoundryValue(max);

      if (typeof maxVal !== 'undefined' && val > maxVal) {
        val = maxVal;
      }

      const minVal = getBoundryValue(min);

      if (typeof minVal !== 'undefined' && val < minVal) {
        val = minVal;
      }

      acc[key] = val;

      return acc;
    }, {} as PropsType);

    setFormState(newState);
    onSubmit(newState);
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn(s.demoParams, { [s._visible]: paramsVisible })}
    >
      <div className={s.demoParamsInner}>
        <div className={s.demoParamsContent}>
          <div className={s.demoParamsInputs}>
            {Object.keys(formState).map((key) => {
              const {
                label,
                min,
                max,
                allowDecimals,
                decimalStep = 0.1,
              } = paramsConfig?.[key] ?? {};

              return (
                <label key={key}>
                  <p>{label}</p>
                  <input
                    key={key}
                    type="number"
                    value={formState[key]}
                    step={allowDecimals ? decimalStep : undefined}
                    min={getBoundryValue(min)}
                    max={getBoundryValue(max)}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [key]: Number(e.currentTarget.value),
                      })
                    }
                    onKeyPress={preventNonNumbers(allowDecimals)}
                  />
                </label>
              );
            })}
          </div>

          <button type="submit" className={s.demoParamsSubmit}>
            <span className="animated-border alt-2" />
            Submit
          </button>
        </div>
      </div>

      <button
        type="button"
        className={s.demoParamsToggle}
        onClick={() => setParamsVisible(!paramsVisible)}
      >
        <span className="animated-border" />
        Params
      </button>
    </form>
  );
}

DemoContainer.Callout = function DemoContainerCallout({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <p className="tutorial-callout" style={style}>
      Don&apos;t forget to check the tutorial below!
    </p>
  );
};

export default DemoContainer;
