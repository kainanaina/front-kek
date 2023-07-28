import s from './styles.module.scss';

function DemoContainer({
  children,
  style,
}: React.PropsWithChildren<{
  style?: React.CSSProperties;
}>) {
  return (
    <div className={s.demoContainer} style={style}>
      {children}
    </div>
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
