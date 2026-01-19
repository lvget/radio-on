import { IcecastMetadataReader } from 'icecast-metadata-js';
import * as chardet from 'chardet';

export type TrackInfo = {
  title: string;
};

export class MetadataReader {
  private reader: typeof IcecastMetadataReader | null = null;
  private controller: AbortController | null = null;

  constructor(
    private url: string,
    private onMetadata: (metadata: TrackInfo) => void,
    private onError: (error: any) => void
  ) {}

  public start() {
    this.stop(); // Stop any existing reader

    this.controller = new AbortController();
    const signal = this.controller.signal;

    fetch(this.url, {
      headers: { 'Icy-Metadata': '1' },
      signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
          throw new Error('Response body is null');
        }

        this.reader = new IcecastMetadataReader({
          onMetadata: (metadata: any) => {
            const streamTitle = metadata.get('StreamTitle');
            if (streamTitle) {
              // The title is often a byte string incorrectly decoded as latin1.
              // We need to convert it back to a byte array to detect the real encoding.
              const titleBuffer = new Uint8Array(streamTitle.length);
              for (let i = 0; i < streamTitle.length; i++) {
                titleBuffer[i] = streamTitle.charCodeAt(i);
              }
              const encoding = chardet.detect(titleBuffer);

              if (encoding) {
                try {
                  const decoder = new TextDecoder(encoding);
                  const decodedTitle = decoder.decode(titleBuffer);
                  this.onMetadata({ title: decodedTitle });
                } catch (e) {
                  // If TextDecoder fails, fallback to the original string
                  this.onMetadata({ title: streamTitle });
                }
              } else {
                // If chardet fails, fallback to the original string
                this.onMetadata({ title: streamTitle });
              }
            }
          },
          onError: this.onError,
        });

        // Pipe the response body to the metadata reader
        const responseReader = response.body.getReader();
        const pump = (): Promise<void> => {
          return responseReader.read().then(({ done, value }) => {
            if (done) {
              return;
            }
            this.reader?.read(value);
            return pump();
          });
        };
        pump().catch(this.onError);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          this.onError(error);
        }
      });
  }

  public stop() {
    this.controller?.abort();
    this.reader = null;
  }
}
