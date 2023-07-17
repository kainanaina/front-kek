import s from './styles.module.scss';

export default function DemoContainer({ children }: React.PropsWithChildren) {
  return <div className={s.demoContainer}>{children}</div>;
}
