'use client';
import { useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import cn from 'classnames';
import { preventNonNumbers } from 'src/utils';
import './styles.scss';

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
  paramsAutoopenDelay = 0,
  paramsInitialVisible = false,
  withCallout = true,
  calloutStyle,
  style,
}: {
  component: React.ComponentType<PropsType>;
  beforeDemo?: React.ReactNode;
  afterDemo?: React.ReactNode;
  initialProps?: PropsType;
  paramsConfig?: ParamsConfigType;
  paramsAutoopenDelay?: number;
  paramsInitialVisible?: boolean;
  withCallout?: boolean;
  calloutStyle?: React.CSSProperties;
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
    <div className="demo-container">
      <div className="demo-content" style={style}>
        <ErrorBoundary
          key={resetKey}
          fallback={
            <div className="demo-error">
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

      {withCallout && (
        <p className="demo-callout" style={calloutStyle}>
          Don&apos;t forget to check the tutorial below!
        </p>
      )}
      {!!Object.keys(paramsConfig)?.length && (
        <DemoParams
          key={`params-${paramsResetKey}`}
          initialProps={initialProps}
          paramsConfig={paramsConfig}
          paramsAutoopenDelay={paramsAutoopenDelay}
          paramsInitialVisible={paramsInitialVisible}
          onSubmit={handleChangeProps}
        />
      )}
    </div>
  );
}

function DemoParams({
  initialProps,
  paramsConfig,
  paramsAutoopenDelay = 0,
  paramsInitialVisible = false,
  onSubmit,
}: {
  initialProps: PropsType;
  paramsConfig?: ParamsConfigType;
  paramsAutoopenDelay?: number;
  paramsInitialVisible?: boolean;
  onSubmit: (props: PropsType) => void;
}) {
  const [formState, setFormState] = useState(initialProps);
  const [paramsVisible, setParamsVisible] = useState(paramsInitialVisible);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (paramsAutoopenDelay) {
      timeoutRef.current = setTimeout(() => {
        setParamsVisible(true);
      }, paramsAutoopenDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
      className={cn('demo-params', { 's--visible': paramsVisible })}
    >
      <div className="demo-params__inner">
        <div className="demo-params__content">
          <div className="demo-params__inputs">
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

          <button type="submit" className="demo-params__submit">
            <span className="animated-border alt-2" />
            Submit
          </button>
        </div>
      </div>

      <button
        type="button"
        className="demo-params__toggle"
        onClick={() => setParamsVisible(!paramsVisible)}
      >
        <span className="animated-border" />
        Params
      </button>
    </form>
  );
}

export default DemoContainer;
