FROM quay.io/keycloak/keycloak:19.0.3
COPY dls-keycloak_v19.jar /opt/keycloak/providers/dls-keycloak.jar
COPY server.keystore /conf/server.keystore

EXPOSE 8443

ENTRYPOINT [ "/opt/keycloak/bin/kc.sh" ] 
