import s from './styles.module.scss';

export default function DemoContainer({
  children,
  style,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div className={s.demoContainer} style={style}>
      {children}
    </div>
  );
}
