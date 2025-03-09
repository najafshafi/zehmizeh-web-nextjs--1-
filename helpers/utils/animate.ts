interface AosPropTypes {
  name?:
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'fade-up-right'
    | 'fade-up-left'
    | 'fade-down-right'
    | 'fade-down-left'
    | 'flip-up'
    | 'flip-down'
    | 'flip-left'
    | 'flip-right'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-in-up'
    | 'zoom-in-down'
    | 'zoom-in-left'
    | 'zoom-in-right'
    | 'zoom-out'
    | 'zoom-out-up'
    | 'zoom-out-down'
    | 'zoom-out-left'
    | 'zoom-out-right';
  placement?:
    | 'top-bottom'
    | 'top-center'
    | 'top-top'
    | 'center-bottom'
    | 'center-center'
    | 'center-top'
    | 'bottom-bottom'
    | 'bottom-center'
    | 'bottom-top';
  anchor?: string;
  duration?: number;
  delay?: number;
  easing?:
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'ease-in-back'
    | 'ease-out-back'
    | 'ease-in-out-back'
    | 'ease-in-sine'
    | 'ease-out-sine'
    | 'ease-in-out-sine'
    | 'ease-in-quad'
    | 'ease-out-quad'
    | 'ease-in-out-quad'
    | 'ease-in-cubic'
    | 'ease-out-cubic'
    | 'ease-in-out-cubic'
    | 'ease-in-quart'
    | 'ease-out-quart'
    | 'ease-in-out-quart';
  once?: boolean;
}

const DEFAULT = {
  name: 'fade-up',
  duration: 1000,
  delay: 0,
  anchor: '',
  placement: 'bottom-bottom',
  easing: 'ease',
} as AosPropTypes;

export function getAosProps(animationProps?: AosPropTypes | undefined) {
  const settings = animationProps ? { ...DEFAULT, ...animationProps } : DEFAULT;
  const { name, duration, delay, anchor, placement, easing, once } = settings;
  const attrs = {
    'data-aos': name,
    'data-aos-duration': duration,
    'data-aos-delay': delay,
    'data-aos-anchor-placement': placement,
    'data-aos-easing': easing,
  };
  if (anchor) {
    attrs['data-aos-anchor'] = anchor;
  }
  if (once !== undefined) {
    attrs['data-aos-once'] = once;
  }
  return attrs;
}
