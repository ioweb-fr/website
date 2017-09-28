import { Button }           from 'react-toolbox/lib/button/index';
import { ContentServices }  from '~/content.js';
import Service              from './service';
import theme                from './style.css';

export default function Services() {
  const $services = ContentServices.list.map(s =>
    <Service title={s.title} subtitle={s.subtitle} image={s.img} />,
  );

  return (
    <section>
      <div class="grid-3-large-1 has-gutter">
        {$services}
      </div>
      <div className="button-bar text-center">
        <Button theme={theme}>
          {ContentServices.texts['button-discover']}
        </Button>
      </div>
    </section>
  );
}
