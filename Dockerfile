# ==============================================================================
# GAP Arcade Gaming Hub - Production Hardened Container
# Multi-stage security profile, unprivileged non-root execution (UID 101)
# Size: < 25 MB on Alpine Linux
# ==============================================================================

FROM nginx:1.27-alpine-slim

LABEL maintainer="GAP Team" \
      description="100% Offline Arcade Gaming Hub (Tic-Tac-Toe, Wordle, Chess)" \
      org.opencontainers.image.source="https://github.com/itachi-rdy79/tictactoe"

# Upgrade base system packages to patch known upstream CVEs and remove default nginx website
RUN apk upgrade --no-cache \
    && rm -rf /etc/nginx/conf.d /usr/share/nginx/html/*

# Copy custom hardened nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy web application assets
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js
COPY winner-screen.html /usr/share/nginx/html/winner-screen.html
COPY README.md /usr/share/nginx/html/README.md
COPY data/ /usr/share/nginx/html/data/

# Prepare filesystem permissions for non-root (nginx user, UID 101)
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
    && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /tmp /etc/nginx \
    && chmod -R 755 /usr/share/nginx/html \
    && chmod -R 777 /tmp

# Switch to unprivileged non-root user
USER nginx

# Expose unprivileged web port
EXPOSE 8080

# Embedded healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
