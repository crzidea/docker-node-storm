FROM openjdk

RUN apt-get update \
    && apt-get install -y host \
    && apt-get clean

# Apache Storm
ENV STORM_VERSION=1.0.5
#ENV STORM_VERSION=1.1.1
ENV STORM_USER=storm \
    STORM_CONF_DIR=/conf \
    STORM_DATA_DIR=/data \
    STORM_LOG_DIR=/logs \
	STORM_DISTRO=apache-storm-$STORM_VERSION

RUN set -x \
    && useradd "$STORM_USER" \
    && mkdir -p "$STORM_CONF_DIR" "$STORM_DATA_DIR" "$STORM_LOG_DIR" \
    && chown -R "$STORM_USER:$STORM_USER" "$STORM_CONF_DIR" "$STORM_DATA_DIR" "$STORM_LOG_DIR" \
    && curl -SLO "https://www.apache.org/dist/storm/$STORM_DISTRO/$STORM_DISTRO.tar.gz" \
    && tar -xzf "$STORM_DISTRO.tar.gz" -C /usr/local --strip-components=1 \
    && rm -r "$STORM_DISTRO.tar.gz"

# Node.js
ENV NODE_VERSION 8.9.4
ENV NPM_CONFIG_LOGLEVEL info

RUN set -x \
  	&& curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  	&& tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  	&& rm "node-v$NODE_VERSION-linux-x64.tar.xz" \
  	&& ln -s /usr/local/bin/node /usr/local/bin/nodejs

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
